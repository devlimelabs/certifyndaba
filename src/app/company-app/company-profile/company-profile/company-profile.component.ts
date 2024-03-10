import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Firestore, doc, updateDoc
} from '@angular/fire/firestore';
import {
  FormBuilder, ReactiveFormsModule, Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { isEqual, omit } from 'lodash';
import { filter, switchMap } from 'rxjs/operators';
import { ImageUploadFieldComponent } from 'src/app/shared/image-upload-field/image-upload-field.component';
import { STATES } from '~constants/states';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [
    CommonModule,
    ImageUploadFieldComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyProfileComponent implements OnInit {

  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(HotToastService);

  readonly states = STATES;

  companyProfile!: any;

  companyProfileChanged = false;

  companyProfileForm = this.fb.group({
    id: '',
    about: '',
    address1: [ '', Validators.required ],
    address2: '',
    city: [ '', Validators.required ],
    email: [ '', [ Validators.email, Validators.required ] ],
    linkedInUrl: '',
    logoImage: '',
    name: [ '', Validators.required ],
    phone: [ '', Validators.required ],
    state: [ '', Validators.required ],
    website: '',
    zip: [ '', Validators.required ]
  });

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ company }) => {
        this.companyProfile = company;
        this.companyProfileForm.patchValue(company);
      });

    this.companyProfileForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(profileFormValue => {
        this.companyProfileChanged = !(isEqual(profileFormValue, omit(this.companyProfile, [
          '__typename',
          'createdAt',
          'updatedAt'
        ])));

        this.cdr.markForCheck();
      });

    this.companyProfileForm.get('logoImage')?.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(logoImage => logoImage !== this.companyProfile.logoImage),
        switchMap(logoImage => {
          const companyRef = doc(this.firestore, `companies/${this.companyProfile.id}`);

          return updateDoc(companyRef, {
            ...this.companyProfileForm.value
          });
        })
      )
      .subscribe(updatedCompany => {
        this.companyProfile = updatedCompany;
        this.companyProfileForm.patchValue(updatedCompany as any);
      });

  }

  async submit(): Promise<void> {
    if (this.companyProfileForm.invalid) {
      this.toast.warning(`Please fill the following required fields out before saving!`);

      return;
    }

    if (this.companyProfileChanged) {
      try {
        const companyRef = doc(this.firestore, `companies/${this.companyProfile.id}`);

        this.companyProfile = await updateDoc(companyRef, {
          ...this.companyProfileForm.value
        });

        this.companyProfileChanged = false;

        this.cdr.markForCheck();

        this.toast.success('Company Profile updates saved!');

        this.router.navigateByUrl('/app/candidate/requests');
      } catch (err) {
        this.toast.error('There was an error saving the company profile! Please try again. If issues persist please contact support for further assistance');
      }
    }
  }

}
