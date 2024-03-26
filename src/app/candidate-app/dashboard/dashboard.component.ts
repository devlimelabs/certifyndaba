import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '~auth/auth.service';
import { showHideHorizontal } from '~animations/show-hide-horizontal';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [ CommonModule, RouterOutlet ],
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
  animations: [ showHideHorizontal() ]
})
export class DashboardComponent {

  private authSvc = inject(AuthService);
  private layoutSvc = inject(LayoutService);

  showRightPanel = toSignal(this.layoutSvc.showRightPanel$);
  username$ = this.authSvc.user$.pipe(map(user => user?.displayName));
}
