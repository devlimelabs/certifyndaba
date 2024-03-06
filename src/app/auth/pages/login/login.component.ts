import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Auth, sendSignInLinkToEmail, signInWithEmailLink, signInWithPopup } from '@angular/fire/auth';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy } from '@ngneat/until-destroy';

import { FacebookAuthButtonComponent } from '../../components/facebook-auth-button/facebook-auth-button.component';
import { GoogleAuthButtonComponent } from '../../components/google-auth-button/google-auth-button.component';
import { MatDialogRef } from '@angular/material/dialog';

@UntilDestroy()
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GoogleAuthButtonComponent,
    FacebookAuthButtonComponent,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class LoginComponent {

  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toast = inject(HotToastService);
  private route = inject(ActivatedRoute);

  dialogRef = inject(MatDialogRef, { optional: true });

  emailLoginForm = this.fb.group({
    email: [ '', [ Validators.required, Validators.email ]],
    rememberMe: false
  });

  emailCtrl!: AbstractControl | null;
  rememberMeCtrl!: AbstractControl | null;

  emailLinkSent = false;
  emailMissing = false;
  errorCount = 0;
  fromEmailLink = false;
  isDialog = false;
  redirect!: string | null;

  ngOnInit(): void {
    console.log('this.dialogRef', this.dialogRef);
    this.isDialog = !!this.dialogRef;
    this.redirect = localStorage.getItem('redirect');
    this.emailCtrl = this.emailLoginForm.get('email');
    this.rememberMeCtrl = this.emailLoginForm.get('rememberMe');

    const email = localStorage.getItem('email');
    const rememberEmail = localStorage.getItem('rememberEmail');

    this.fromEmailLink = this.route.snapshot?.queryParams?.['loginWithEmailLink'];

    if (email) {
      this.emailLoginForm.patchValue({
        email,
        rememberMe: !!rememberEmail
      });

      if (this.fromEmailLink) {
        this.signInWithEmailLink(email);
      }
    } else if (this.fromEmailLink) {
      this.emailMissing = true;
      this.cdr.markForCheck();
    }
  }

  async getEmailLink(): Promise<any> {
    const email = this.emailCtrl?.value

    if (!email) {
      this.toast.error('Email is required for passwordless signup');
      return false;
    }

    try {
      localStorage.setItem('email', email);

      if (this.rememberMeCtrl?.value) {
        localStorage.setItem('rememberEmail', 'true');
      } else {
        localStorage.removeItem('rememberEmail');
      }

      const actionCodeSettings = {
        url: window.location.href + '?loginWithEmailLink=true',
        handleCodeInApp: true
      };

      await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);

      this.emailLinkSent = true;
      this.cdr.markForCheck();
    } catch(error: any) {
      const errorCode = error.code;
      console.debug('errorCode', errorCode);
      let errorMessage = 'There was an issue logging you in!';

      if (errorCode === 'auth/user-not-found') {
        errorMessage = 'User Not Found!'
      }

      this.toast.error(errorMessage);
    }

    return false;
  }

  async signInWithEmailLink(email?: string): Promise<any> {
    try {
      if (email && this.emailCtrl?.valid) {
        await signInWithEmailLink(this.auth, email, window.location.href);
      } else {
        return false;
      }

      if (!this.rememberMeCtrl?.value) {
        localStorage.removeItem('email');
      }

      if (this.redirect) {
        localStorage.removeItem('redirect');
        return this.router.navigateByUrl(this.redirect);
      }

      if (this.isDialog) {
        return this.dialogRef?.close();
      } else {
        return this.router.navigate(['/']);
      }
    } catch(error: any) {
      const errorCode = error?.code;
      console.log('error', error);
      let errorMessage = 'There was an issue logging you in!';

      if (errorCode === 'auth/user-not-found') {
        errorMessage = 'User Not Found!'
      }

      this.toast.error(errorMessage);

      if (errorCode === 'auth/wrong-password' && this.errorCount >= 1) {
        this.toast.info('Perhaps you signed up with a social account under the same email?', { position: 'top-right' });
      }

      this.errorCount += 1;

      console.log('errorMessage', errorMessage);
    }
  }
}
