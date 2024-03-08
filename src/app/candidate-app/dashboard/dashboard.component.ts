import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '~auth/auth.service';

@Component({
  standalone: true,
  imports: [ CommonModule, RouterOutlet ],
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent {

  private authSvc = inject(AuthService);

  username$ = this.authSvc.user$.pipe(map(user => user?.displayName));
}
