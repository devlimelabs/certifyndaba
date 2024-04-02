import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { RequestsTableComponent } from 'src/app/requests/components/requests-table/requests-table.component';
import { CertificationNamePipe } from 'src/app/shared/certification-name/certification-name.pipe';
import { DaysAgoPipe } from 'src/app/shared/days-ago/days-ago.pipe';

@Component({
  selector: 'app-company-requests-display-list',
  templateUrl: './company-requests-display-list.component.html',
  styleUrls: [ './company-requests-display-list.component.scss' ],
  standalone: true,
  imports: [
    CertificationNamePipe,
    CommonModule,
    DaysAgoPipe,
    RequestsTableComponent,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyRequestsDisplayListComponent {

  private cdr = inject(ChangeDetectorRef);
  private router = inject(ActivatedRoute);

  requests$ = this.router.data.pipe(map(({ requests }) => requests));

}
