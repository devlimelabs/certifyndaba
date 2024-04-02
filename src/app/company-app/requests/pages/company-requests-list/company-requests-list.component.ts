import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Component, DestroyRef, inject, OnInit
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {
  ActivatedRoute, Router, RouterModule
} from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

import {
  CompanyRequestsDisplayListComponent
} from '../../components/company-requests-display-list/company-requests-display-list.component';
import { RequestsTableComponent } from 'src/app/requests/components/requests-table/requests-table.component';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CommonModule,
    RequestsTableComponent,
    RouterModule,
    MatTabsModule,
    CompanyRequestsDisplayListComponent
  ],
  templateUrl: './company-requests-list.component.html',
  styleUrls: [ './company-requests-list.component.scss' ]
})
export class CompanyRequestsListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  public route = inject(ActivatedRoute);
  private router = inject(Router);

  links = [
    {
      label: 'Pending',
      link: '/app/company/requests/Pending'
    },
    {
      label: 'Accepted',
      link: '/app/company/requests/Accepted'
    },
    {
      label: 'Rejected',
      link: '/app/company/requests/Rejected'
    }
  ];

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: any) => {
        if (!params?.status) {
          this.router.navigate([ 'Pending' ], { relativeTo: this.route });
        }
      });
  }
}
