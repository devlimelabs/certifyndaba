import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit
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
import { STATES } from '~constants/states';
import { StateSelectorComponent } from './components/state-selector/state-selector.component';
import filter from 'lodash/filter';
import map from 'lodash/map';
import startCase from 'lodash/startCase';
import {
  Firestore, doc, updateDoc
} from '@angular/fire/firestore';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthStore } from '~auth/state/auth.store';
import { CandidateListItemComponent } from 'src/app/company-app/candidate-search/components/candidate-list-item/candidate-list-item.component';

@Component({
  standalone: true,
  imports: [
    CandidateListItemComponent,
    CertificationNumberInputComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSliderModule,
    MultiCheckboxComponent,
    ReactiveFormsModule,
    StateSelectorComponent
  ],
  providers: [ TitleCasePipe ],
  templateUrl: './profile.component.html',
  styleUrls: [ './profile.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  readonly clientPopulations = [
    {
      label: 'Children',
      value: 'Children'
    },
    {
      label: 'Adolescents',
      value: 'Adolescents'
    },
    {
      label: 'Adults',
      value: 'Adults'
    },
    {
      label: 'Elderly',
      value: 'Elderly'
    }
  ];

  readonly employmentTypes = [
    {
      label: 'Full-Time',
      value: 'full-time'
    },
    {
      label: 'Part-Time',
      value: 'part-time'
    },
    {
      label: 'Contract',
      value: 'contract'
    },
    {
      label: 'Internship',
      value: 'internship'
    },
    {
      label: 'Temporary',
      value: 'temporary'
    }
  ];

  readonly environments = [
    {
      label: 'Clinic',
      value: 'clinic'
    },
    {
      label: 'Home',
      value: 'home'
    },
    {
      label: 'School',
      value: 'school'
    },
    {
      label: 'Residence / Group Home',
      value: 'residence'
    },
    {
      label: 'Other',
      value: 'other'
    }
  ];

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

  readonly states = STATES;
  showAreasOfInterest = false;
  profile!: any;

  profileChanged$!: Observable<boolean>;
  profileChanged = false;

  profileForm = this.fb.group({
    id: [ '', Validators.required ],
    about: '',
    address1: '',
    address2: '',
    availabilityStatus: '',
    certificationNumber: '',
    city: '',
    clientPopulations: [],
    country: '',
    email: [ '', Validators.required ],
    employer: '',
    employmentTypes: [],
    environments: [],
    experienceLevel: [ '', Validators.required ],
    firstName: [ '', Validators.required ],
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
    yearsOfExperience: '',
    zip: ''
  });

  pushNotificationsCtrl = new FormControl();

  userPushSettings!: any; // UserPushSettings;

  get user(): any {
    return this.authStore.userProfile();
  }

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ profile, userPushSettings }) => {
        this.profile = profile;
        this.userPushSettings = userPushSettings;
        this.profileForm.patchValue(profile);
        // /* TODO: make this form an object */
        // const activePushTopics = [];
        // const pushTopics = [
        //   'requests',
        //   'messages',
        //   'updates'
        // ];

        // for (let topic of pushTopics) {
        //   if (userPushSettings?.[topic]) {
        //     activePushTopics.push(topic);
        //   }
        // }

        // this.pushNotificationsCtrl.patchValue(activePushTopics);
      });

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

    this.profileForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(profileFormValue => {
        this.profileChanged = !(isEqual(profileFormValue, omit(this.profile, [
          '__typename',
          'createdAt',
          'updatedAt'
        ])));

        this.cdr.markForCheck();
      });


    // this.pushNotificationsCtrl.valueChanges
    //   .pipe(
    //     takeUntilDestroyed(this.destroyRef),
    //     switchMap(async pushTopics => this.api.UpdateUserPushSettings({
    //       userID: this.user.sub,
    //       requests: pushTopics.includes('requests'),
    //       messages: pushTopics.includes('messages'),
    //       updates: pushTopics.includes('updates')
    //     }))
    //   )
    //   .subscribe(() => {
    //     this.toast.success('Notification Settings Updated!');
    //   });
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

    if (this.profileChanged) {
      console.log('this.profileChanged', this.profileChanged);
      const personalInfoDetected = this.checkForPersonalInfoInAbout();

      if (personalInfoDetected) {
        this.toast.warning('Your about section appears to contain personal information. In order to ensure your privacy, please remove all personal information from your about section.', {
          duration: 7500
        });

        return;
      }

      try {
        const usersRef = doc(this.firestore, `users/${this.profile.id}`);

        await updateDoc(usersRef, this.profileForm.value);

        this.profile = { ...this.profileForm.value };
        this.profileChanged = false;

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
      const fieldValue = this.profileForm?.get(field)?.value?.toLowerCase();

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
}
