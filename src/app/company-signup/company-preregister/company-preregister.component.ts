import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef, Component, inject, Input, OnInit
} from '@angular/core';
import {
  FormBuilder, ReactiveFormsModule, Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgFormsManager } from '@ngneat/forms-manager';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { InputErrorComponent } from 'src/app/shared/input-error/input-error.component';
import ERROR_MESSAGES from '~constants/error-messages';
import { STATES } from '~constants/states';
import { LayoutService } from '../../layout/service/layout.service';
import { generateClient } from 'aws-amplify/api';

@UntilDestroy()
@Component({
  selector: 'app-company-preregister',
  standalone: true,
  imports: [
    CommonModule,
    InputErrorComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './company-preregister.component.html',
  styleUrls: [ './company-preregister.component.scss' ]
})
export class CompanyPreregisterComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private client = generateClient();
  private fb = inject(FormBuilder);
  private formsManager = inject(NgFormsManager);
  private layoutSvc = inject(LayoutService);
  private router = inject(Router);
  private toast = inject(HotToastService);


  readonly states = STATES;

  @Input() showLogo = true;

  errorMessages: any = { ...ERROR_MESSAGES };

  errors: { [key:string]: string[] } = {
    company: [],
    firstName: [],
    lastName: [],
    email: [],
    phone: [],
    position: []
  };

  signedUp = false;

  signupForm = this.fb.group({
    company: [ '', Validators.required ],
    firstName: [ '', Validators.required ],
    lastName: [ '', Validators.required ],
    email: [ '', [ Validators.required, Validators.email ] ],
    phone: [ '' ],
    position: [ '' ]
  });

  ngOnInit(): void {
    this.signedUp = !!localStorage.getItem('isPreregisteredCompanyUser');
    this.formsManager.upsert('signUp', this.signupForm);

    for (let control of Object.keys(this.errors)) {
      if (this.signupForm.get(control)) {
        this.formsManager.errorsChanges('signUp', control)
          .pipe(untilDestroyed(this))
          .subscribe(changes => {
            this.errors[control] = changes ? Object.keys(changes) : [];
            this.cdr.markForCheck();
          });
      }
    }
  }

  async signup(): Promise<void> {
    const {
      company, firstName, lastName, position, email, phone
    } = this.signupForm.value;

    if (this.signupForm.invalid) {
      this.toast.warning('Please complete all fields to create your account.');
      return;
    }

    let phoneNumber = phone?.replace(/[\(\)\-\s]/g, '');

    if (!phoneNumber?.startsWith('+1')) {
      phoneNumber = `+1${phoneNumber}`;
    }

    try {
      const preregisterCompanyUserCreate: any = `
        mutation CreatePreregisterCompanyUser(
          $input: CreatePreregisterCompanyUserInput!
          $condition: ModelPreregisterCompanyUserConditionInput
        ) {
          createPreregisterCompanyUser(input: $input, condition: $condition) {
            id
            email
            phone
            firstName
            lastName
            position
            company
            companyCreated
            createdAt
            updatedAt
            __typename
          }
        }
      `;

      const companyUser = await (this.client.graphql({
        query: preregisterCompanyUserCreate,
        variables: {
          input: {
            firstName,
            lastName,
            email,
            phone,
            company,
            position
          }
        },
        authMode: 'iam'
      }) as Promise<any>);

      console.log('companyUser', companyUser);

      this.signedUp = true;
      localStorage.setItem('isPreregisteredCompanyUser', 'true');
      localStorage.setItem('preregisteredUserID', companyUser?.data?.createPreregisterCompanyUser?.id);
      this.cdr.markForCheck();
    } catch (err: any) {
      if (err.code === 'UsernameExistsException') {
        this.signupForm.get('email')?.setErrors({
          accountExists: true
        });
      }

      this.toast.error(err?.message);
    }
  }

}
