import { CommonModule } from '@angular/common';
import {
  Component, inject, OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/auth/auth.service';

@Component({
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './app-redirect.component.html',
  styleUrls: [ './app-redirect.component.scss' ]
})
export class AppRedirectComponent implements OnInit {
  private router = inject(Router);
  private authSvc = inject(AuthService);

  ngOnInit(): void {

    const user = this.authSvc.$claims() as any;

    if (user?.role == 'admin') {
      this.router.navigateByUrl('/app/admin/verifications');
    } else if (user?.accountType === 'candidate') {
      this.router.navigateByUrl('/app/candidate/profile');
    } else if (user?.accountType === 'company') {
      this.router.navigateByUrl('/app/company/requests');
    }
  }
}
