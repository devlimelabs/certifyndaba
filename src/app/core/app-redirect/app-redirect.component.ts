import { CommonModule } from '@angular/common';
import {
  Component, DestroyRef, inject, OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './app-redirect.component.html',
  styleUrls: [ './app-redirect.component.scss' ]
  // host: { ngskingSkipHydration: 'true' } // eslint-disable-line @angular-eslint/no-host-metadata-property
})
export class AppRedirectComponent implements OnInit {

  private router = inject(Router);
  private authSvc = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.authSvc.claims$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        console.log('user', user);
        if (user?.role === 'admin') {
          this.router.navigateByUrl('/app/admin/verifications');
        } else if (user?.accountType === 'candidate') {
          this.router.navigateByUrl('/app/candidate/profile');
        } else if (user?.accountType === 'company') {
          this.router.navigateByUrl('/app/company/requests');
        }
      });
  }
}
