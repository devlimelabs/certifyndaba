import { CommonModule } from '@angular/common';
import {
  Component, DestroyRef, inject, OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom } from 'rxjs';

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

  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this.authSvc.claims$.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(claims => !!claims)
    ));

    if (user?.role === 'admin') {
      this.router.navigateByUrl('/app/admin/verifications');
    } else if (user?.accountType === 'candidate') {
      this.router.navigateByUrl('/app/candidate');
    } else if (user?.accountType === 'company') {
      this.router.navigateByUrl('/app/company/requests');
    }
  }
}
