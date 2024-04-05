import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component, DestroyRef, inject, OnInit, signal
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { RequestsTableComponent } from 'src/app/requests/components/requests-table/requests-table.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RequestsTableComponent,
    RouterModule,
    MatTabsModule
  ],
  templateUrl: './company-requests-list.component.html',
  styleUrls: [ './company-requests-list.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' } // eslint-disable-line @angular-eslint/no-host-metadata-property
})
export class CompanyRequestsListComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);

  allRequests = signal<Request[]>([]);

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ requests }) => {
        console.log('requests', requests);
        this.allRequests.set(requests);
      });
  }
}
