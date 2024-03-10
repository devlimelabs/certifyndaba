import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef, Component, inject, Input, OnInit 
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { NgFormsManager } from '@ngneat/forms-manager';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Auth } from 'aws-amplify';
import { camelCase, upperFirst } from 'lodash';
import { InputErrorComponent } from 'src/app/shared/input-error/input-error.component';
import ERROR_MESSAGES from '~constants/error-messages';
import { STATES } from '~constants/states';

import { UserConfirmationComponent } from '../auth/components/user-confirmation/user-confirmation.component';
import { LayoutService } from '../layout/service/layout.service';
import { CompanyPlanOptionsComponent } from './components/company-plan-options/company-plan-options.component';

@UntilDestroy()
@Component({
  selector: 'app-company-signup',
  templateUrl: './company-signup.component.html',
  imports: [
    CommonModule,
    CompanyPlanOptionsComponent,
    InputErrorComponent,
    ReactiveFormsModule,
    RouterLink,
    UserConfirmationComponent
  ],
  standalone: true,
  styleUrls: [ './company-signup.component.scss' ]
})
export class CompanySignupComponent implements OnInit {

  private authenticator = inject(AuthenticatorService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private formsManager = inject(NgFormsManager);
  private layoutSvc = inject(LayoutService);
  private router = inject(Router);
  private toast = inject(HotToastService);

  private checkPasswordsMatch: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group?.get('password')?.value;
    let confirmPass = group?.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  };

  readonly states = STATES;

  @Input() showLogo = true;

  errorMessages: any = { ...ERROR_MESSAGES };

  errors: { [key:string]: string[] } = {
    address1: [],
    address2: [],
    city: [],
    state: [],
    zip: [],
    companyName: [],
    firstName: [],
    lastName: [],
    email: [],
    password: [],
    confirmPassword: [],
    phone: [],
    position: [],
    plan: []
  };

  passwordMismatch = false;

  signedUp = false;

  signupForm = this.fb.group({
    address1: [ '', Validators.required ],
    address2: [ '' ],
    city: [ '', Validators.required ],
    state: [ '', Validators.required ],
    zip: [ '', Validators.required ],
    companyName: [ '', Validators.required ],
    firstName: [ '', Validators.required ],
    lastName: [ '', Validators.required ],
    email: [ '', [ Validators.required, Validators.email ] ],
    password: [ '', Validators.required ],
    confirmPassword: [ '', Validators.required ],
    phone: [ '', Validators.required ],
    plan:  '', // Removed Validators.required temporarily
    position:  [ '', Validators.required ]
  }, { validators: this.checkPasswordsMatch });

  get planCtrl(): FormControl {
    return this.signupForm.get('plan') as FormControl;
  }

  ngOnInit(): void {
    this.formsManager.upsert('signUp', this.signupForm);

    this.formsManager.errorsChanges('signUp')
      .pipe(untilDestroyed(this))
      .subscribe(changes => {
        this.passwordMismatch = changes?.passwordMismatch;
        this.cdr.markForCheck();
      });

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
      companyName, address1, address2, city, state, zip, firstName, lastName, position, email, phone, password, plan
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
      await Auth.signUp({
        username: email ?? '',
        password: password ?? '',
        attributes: {
          given_name: firstName,
          family_name: lastName,
          email,
          phone_number: phoneNumber,
          'custom:accountType': 'company',
          'custom:address1': address1,
          'custom:address2': address2,
          'custom:city': city,
          'custom:state': state,
          'custom:zip': zip,
          'custom:companyName': companyName,
          'custom:companyGroupID': `company${upperFirst(camelCase(companyName?.replace(/\s+/g, '')))}`,
          'custom:plan': plan,
          'custom:position': position
        }
      });

      this.signedUp = true;
      this.layoutSvc.scrollToTop();
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
