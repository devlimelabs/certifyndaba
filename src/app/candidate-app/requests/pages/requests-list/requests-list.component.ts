import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DestroyRef, inject, OnInit
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Dictionary, groupBy } from 'lodash';

import { RequestsDisplayListComponent } from '../../components/requests-display-list/requests-display-list.component';
import { RequestsTableComponent } from 'src/app/requests/components/requests-table/requests-table.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTabsModule,
    RequestsDisplayListComponent,
    RequestsTableComponent
  ],
  templateUrl: './requests-list.component.html',
  styleUrls: [ './requests-list.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsListComponent implements OnInit {

  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);

  allRequests: any[] = [];

  requests: Dictionary<any[]> = {
    Pending: [],
    Accepted: [],
    Rejected: []
  };

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ requests }) => {
        this.allRequests = requests;
        this.requests = groupBy(requests, 'status');
        this.cdr.markForCheck();
      });
  }
}

// {
//   id: 1,
//   company: {
//     name: 'Bierman Autism Center',
//     image: 'https://www.biermanautism.com/wp-content/uploads/2021/12/Penguin_V4-03-e1638487759816.png',
//     email: '',
//     phone: '(781) 479-2261',
//     address1: '145 Rosemary Street',
//     address2: 'Suite A',
//     city: 'Needham',
//     state: 'MA',
//     zip: '02494',
//     website: 'https://www.biermanautism.com/'
//   },
//   title: 'Board Certified Behavior Analyst (BCBA)',
//   salary: '80k',
//   location: 'Needham, MA',
//   createdAt: '2023-04-21T23:57:04+0000',
//   startTimeFrame: '2023-04-21T23:57:04+0000',
//   description: ''
// },
// {
//   id: 2,
//   company: {
//     name: 'Bierman Autism Center',
//     image: 'https://www.biermanautism.com/wp-content/uploads/2021/12/Penguin_V4-03-e1638487759816.png',
//     email: '',
//     phone: '(781) 479-2261',
//     address1: '23 Crosby Drive',
//     address2: 'Suite 300',
//     city: 'Bedford',
//     state: 'MA',
//     zip: '01730',
//     website: 'https://www.biermanautism.com/'
//   },
//   title: 'Remote BCBA - Clinical Supervisor',
//   salary: '125k',
//   location: 'Bedford, MA',
//   createdAt: '2023-04-21T23:57:04+0000',
//   startTimeFrame: '2023-04-21T23:57:04+0000',
//   description: ''
// }
