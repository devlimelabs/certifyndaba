import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, inject
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';

import { RequestsService } from '../../service/requests.service';

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

  private requestsSvc = inject(RequestsService);

  showBackToList$ = this.requestsSvc.showBacktoList$;
  showRequestButton$ = this.requestsSvc.showRequestButton$;
  backToListLink$ = this.requestsSvc.backToListLink$;

}
