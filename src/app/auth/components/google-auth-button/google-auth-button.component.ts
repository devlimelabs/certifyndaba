import {
  ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output
} from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Functions } from '@angular/fire/functions';
import { GOOGLE_ICON } from './google-icon';
import { LocalStorage } from 'src/app/core/local-storage';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '~auth/auth.service';

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

  private authSvc = inject(AuthService);
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
    const provider = new GoogleAuthProvider();
    return await this.authSvc.initSignIn(provider);
  }

}
