import { CommonModule } from '@angular/common';
import {
  Component, DestroyRef, inject, OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom } from 'rxjs';
import { LocalStorage } from '../local-storage';

@Component({
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './app-redirect.component.html',
  styleUrls: [ './app-redirect.component.scss' ]
})
export class AppRedirectComponent implements OnInit {

  private router = inject(Router);
  private authSvc = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private localStorage = inject(LocalStorage);

  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this.authSvc.claims$.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(claims => !!claims)
    ));

    const redirect = this.localStorage.getItem('redirect');

    if (redirect) {
      this.localStorage.removeItem('redirect');
      this.router.navigateByUrl(redirect);
    } else if (user?.role === 'admin') {
      this.router.navigateByUrl('/app/admin/verifications');
    } else if (user?.accountType === 'candidate') {
      this.router.navigateByUrl('/app/candidate/profile');
    } else if (user?.accountType === 'company') {
      this.router.navigateByUrl('/app/company/requests');
    }
  }
}
