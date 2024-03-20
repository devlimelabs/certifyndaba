import {
  ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output
} from '@angular/core';
import {
  Auth, getAdditionalUserInfo, GoogleAuthProvider, signInWithPopup
} from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Functions } from '@angular/fire/functions';
import { GOOGLE_ICON } from './google-icon';
import { LocalStorage } from 'src/app/core/local-storage';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '~env';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-google-auth-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  templateUrl: './google-auth-button.component.html',
  styleUrls: [ './google-auth-button.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleAuthButtonComponent {

  private auth = inject(Auth);
  private functions = inject(Functions);
  private http = inject(HttpClient);
  private iconRegistry = inject(MatIconRegistry);
  private localStorage = inject(LocalStorage);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private snackBar = inject(MatSnackBar);

  @Input() authType: 'Login' | 'Sign Up' = 'Login';

  @Input() isDialog = false;

  @Output() closeDialog = new EventEmitter<void>();

  constructor() {
    this.iconRegistry.addSvgIconLiteral('google', this.sanitizer.bypassSecurityTrustHtml(GOOGLE_ICON));
  }

  async loginWithGoogle(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider();

      const authResult = await signInWithPopup(this.auth, provider);

      const additionalInfo = getAdditionalUserInfo(authResult);

      if (additionalInfo?.isNewUser) {
        console.log('authResult', authResult);

        const idToken = await authResult.user.getIdToken();

        await firstValueFrom(this.http.post(`https://us-central1-${environment.firebase.projectId}.cloudfunctions.net/addClaims`, {
          accountType: 'candidate',
          idToken
        }));

        await authResult.user.getIdToken(true);
      }

      const redirect = this.localStorage.getItem('redirect');
      console.log('redirect', redirect);

      if (redirect) {
        this.localStorage.removeItem('redirect');
        return this.router.navigateByUrl(redirect);
      }

      if (this.isDialog) {
        this.closeDialog.emit();
        return true;
      }

      return this.router.navigate([ '/' ]);
    } catch (err) {
      console.error('error', err);
      this.snackBar.open('There was an error logging you in!', 'ok', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'bg-red-50 text-red-600'
      });

      return false;
    }
  }

}
