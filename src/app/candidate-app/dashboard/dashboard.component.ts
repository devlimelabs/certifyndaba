import {
  Component, inject, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { showHideHorizontal } from '~animations/show-hide-horizontal';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthStore } from '~auth/state/auth.store';
import { showHideVertical } from '~animations/show-hide-vertical';

@Component({
  standalone: true,
  imports: [ CommonModule, RouterOutlet ],
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
  animations: [ showHideHorizontal(), showHideVertical() ]
})
export class DashboardComponent {

  private layoutSvc = inject(LayoutService);

  authStore = inject(AuthStore);

  showRightPanel = toSignal(this.layoutSvc.showRightPanel$);
  showMessage = signal(true);

  toggleWelcomeMessage() {
    this.showMessage.update(show => !show);
  }
}
