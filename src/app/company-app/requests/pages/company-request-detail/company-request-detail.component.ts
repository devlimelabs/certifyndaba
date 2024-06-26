import { CommonModule } from '@angular/common';
import {
  Component, computed, inject, input
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CandidateListItemComponent } from 'src/app/company-app/candidate-search/components/candidate-list-item/candidate-list-item.component';
import { Request } from 'src/app/models/request';
import { CertificationNamePipe } from 'src/app/shared/certification-name/certification-name.pipe';
import { SanitizePipe } from '~shared/sanitize.pipe';
import { ConnectedCandidateCardComponent } from '../components/connected-candidate-card/connected-candidate-card.component';
import { Candidate } from '~models/candidate';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CandidateListItemComponent,
    CertificationNamePipe,
    CommonModule,
    ConnectedCandidateCardComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    SanitizePipe
  ],
  templateUrl: './company-request-detail.component.html'
})
export class CompanyRequestDetailComponent {

  private route = inject(ActivatedRoute);

  candidate = input<Candidate>();
  request = input<Request>();

  isAccepted = computed(() => this.request()?.status === 'Accepted');

  statusClasses = computed(() => {
    const classMap = {
      'Pending': 'bg-blue-100 border-blue-800 text-blue-800',
      'Accepted':'bg-green-50 border-green-500 text-green-600',
      'Rejected': 'bg-red-50 border-red-500 text-red-600'
    };

    const status = this.request()?.status ?? 'Pending';

    return classMap[status];
  });

  statusIcon = computed(() => {
    const iconMap = {
      'Pending': 'schedule',
      'Accepted': 'check',
      'Rejected': 'close'
    };

    const status = this.request()?.status ?? 'Pending';

    return iconMap[status];
  });


  async cancelRequest(): Promise<void> {

  }
}
