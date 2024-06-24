import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, inject
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';

import { RequestsStore } from '../../state/requests.state';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './requests.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsComponent {

  store = inject(RequestsStore);
}
