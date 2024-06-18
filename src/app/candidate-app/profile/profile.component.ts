import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  OnInit
} from '@angular/core';
import {
  FormControl, ReactiveFormsModule, UntypedFormBuilder, Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import { Observable } from 'rxjs';
import {
  CertificationNumberInputComponent
} from 'src/app/shared/certification-number-input/certification-number-input.component';
import { MultiCheckboxComponent } from 'src/app/shared/multi-checkbox/multi-checkbox.component';
import { StateSelectorComponent } from './components/state-selector/state-selector.component';
import filter from 'lodash/filter';
import map from 'lodash/map';
import startCase from 'lodash/startCase';
import {
  Firestore, doc, updateDoc
} from '@angular/fire/firestore';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AuthStore } from '~auth/state/auth.store';
import { CandidateListItemComponent } from 'src/app/company-app/candidate-search/components/candidate-list-item/candidate-list-item.component';
import { patchState } from '@ngrx/signals';
import { MatSelectModule } from '@angular/material/select';
import { InputComponent } from 'src/app/forms/input/input.component';
import { InputGroup } from 'src/app/forms/forms';
import { LocationSearchComponent } from 'src/app/forms/location-search/location-search.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [
    CandidateListItemComponent,
    CertificationNumberInputComponent,
    CommonModule,
    InputComponent,
    LocationSearchComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MultiCheckboxComponent,
    ReactiveFormsModule,
    StateSelectorComponent
  ],
  providers: [ TitleCasePipe ],
  templateUrl: './profile.component.html',
  styleUrls: [ './profile.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' } // eslint-disable-line @angular-eslint/no-host-metadata-property
})
export class ProfileComponent implements OnInit {

  private authStore = inject(AuthStore);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleCase = inject(TitleCasePipe);
  private toast = inject(HotToastService);


  inputGroups = model<InputGroup[]>();
  profile = input<any>();
  userPushSettings = input<any>();

  readonly notifications = [
    {
      label: 'Connection Requests',
      value: 'requests',
      description: 'Get notified when a clinic sends you a connection request.'
    },
    {
      label: 'Messages',
      value: 'messages',
      description: 'Get notified when a clinic sends you a message within a connection.'
    },
    {
      label: 'Updates & New Features',
      value: 'updates',
      description: 'Get notified about updates & new features within Certifynd.'
    }
  ];

  profileChanged$!: Observable<boolean>;
  profileChanged = computed(() => {
    const formValue = this.$profileFormValue();
    const profile = this.profile();


    return !(isEqual(formValue, omit(profile, [
      '__typename',
      'createdAt',
      'updatedAt'
    ])));

  });

  profileForm = this.fb.group({
    _geo: this.fb.group({
      lat: '',
      lng: ''
    }),
    id: [ '', Validators.required ],
    about: '',
    location: '',
    availabilityStatus: '',
    certificationNumber: '',
    clientPopulations: [],
    email: [ '', Validators.required ],
    employer: '',
    employmentTypes: [],
    environments: [],
    experienceLevel: [ '', Validators.required ],
    firstName: [ '', Validators.required ],
    happyAtCurrentEmployer: '',
    lastName: [ '', Validators.required ],
    lengthOfEmployment: '',
    linkedInProfileUrl: '',
    locationsOfInterest: [],
    phone: [ '', Validators.required ],
    position: '',
    profileImage: '',
    relocation: null,
    salary: '',
    startDate: '',
    state: '',
    yearsOfExperience: ''
  });

  $profileFormValue = toSignal(this.profileForm.valueChanges);

  pushNotificationsCtrl = new FormControl();

  showAreasOfInterest = false;

  get user(): any {
    return this.authStore.userProfile();
  }

  ngOnInit(): void {
    this.profileForm.patchValue(this.profile());

    this.profileForm.get('experienceLevel')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(experienceLevel => {
        if ([
          'RBT',
          'BCaBA',
          'BCBA',
          'BACBD'
        ].includes(experienceLevel)) {
          this.profileForm.addControl('certificationNumber', new FormControl('', Validators.required));
        } else {
          this.profileForm.removeControl('certificationNumber');
        }
      });
  }

  async submit(): Promise<void> {
    if (this.profileForm.invalid) {
      const requiredFields = [
        'email',
        'experienceLevel',
        'firstName',
        'lastName',
        'phone'
      ];

      const missingRequiredFields = filter(requiredFields, field => this.profileForm.get(field)?.errors?.['required']);

      if (missingRequiredFields.length) {
        const fields: any = map(missingRequiredFields, (field: string) => startCase(field));

        let joinStr = ', ';

        if (missingRequiredFields.length > 1) {
          fields[fields.length - 1] = `and ${fields[fields.length - 1]}`;
        }

        if (missingRequiredFields.length === 2) {
          joinStr = ' ';
        }

        this.toast.warning(`Please fill the following required fields out before saving: ${fields.join(joinStr)}`);
      }

      if (this.profileForm.errors?.['identityRevealed']) {
        this.toast.warning('Your about section appears to contain personal information. In order to ensure your privacy, please remove all personal information from your about section.', {
          duration: 7500
        });
      }

      return;
    }

    if (this?.profileChanged()) {
      const personalInfoDetected = this.checkForPersonalInfoInAbout();

      if (personalInfoDetected) {
        this.toast.warning('Your about section appears to contain personal information. In order to ensure your privacy, please remove all personal information from your about section.', {
          duration: 7500
        });

        return;
      }

      try {
        const usersRef = doc(this.firestore, `users/${this.profile().id}`);

        await updateDoc(usersRef, this.profileForm.value);

        this.profile = { ...this.profileForm.value };
        patchState(this.authStore, { userProfile: this.profile() });

        this.cdr.markForCheck();

        this.toast.success('Profile updates saved!');

        this.router.navigateByUrl('/app/candidate');
      } catch (err) {
        this.toast.error('There was an error saving the profile! Please try again. If issues persist please contact support for further assistance');
      }
    }
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  checkForPersonalInfoInAbout(): boolean {
    let personalInfoFound = false;

    const personalInfoFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'linkedInProfileUrl'
    ];

    const about = this.profileForm.get('about');

    const matchingFields: any = filter(personalInfoFields, (field: string) => {
      const fieldValue = `${this.profileForm?.get(field)?.value}`?.toLowerCase() ?? '';

      return fieldValue?.length && about?.value?.toLowerCase()?.includes(fieldValue);
    });


    if (matchingFields.length > 0) {
      personalInfoFound = true;

      for (let field of matchingFields) {
        this.toast.warning(`Your about section contains your ${startCase(field)}: ${this.profileForm?.get(field)?.value}`);
      }
    }

    return personalInfoFound ;
  }

  isCertified(): boolean {
    return [
      'RBT',
      'BCaBA',
      'BCBA',
      'BACBD'
    ].includes(this.profileForm?.value?.experienceLevel ?? '');
  }

  setLatLng({ latitude, longitude }: { latitude: number; longitude: number }): void {
    this.profileForm.patchValue({
      _geo: {
        lat: latitude,
        lng: longitude
      }
    });
  }

  toggleInputGroup(index: number): void {
    this.inputGroups.update(groups => {
      (groups ??= [])[index].isOpen = !groups[index].isOpen;

      return groups;
    });
  }
}
