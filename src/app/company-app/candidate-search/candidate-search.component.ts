import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import sortBy from 'lodash/sortBy';
import { BehaviorSubject } from 'rxjs';

import { CandidateListItemComponent } from './components/candidate-list-item/candidate-list-item.component';
import { SearchHeaderComponent } from './components/search-header/search-header.component';
import { FILTER_CATEGORIES } from './constants/filter-categories';
import { Company } from '~models/company';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService } from 'src/app/search/services/search.service';
import { SearchState } from 'src/app/search/state/search.state';
import { RefinementListComponent } from '~search/components/refinement-list/refinement-list.component';


@Component({
  standalone: true,
  imports: [
    CandidateListItemComponent,
    CommonModule,
    MatMenuModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    RefinementListComponent,
    ScrollingModule,
    SearchHeaderComponent
  ],
  templateUrl: './candidate-search.component.html',
  styleUrls: [ './candidate-search.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: 'true' } // eslint-disable-line @angular-eslint/no-host-metadata-property
})
export class CandidateSearchComponent implements OnInit {

  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private toast = inject(HotToastService);
  private loading = new BehaviorSubject<boolean>(false);
  private loadingMore = new BehaviorSubject<boolean>(false);
  private searchSvc = inject(SearchService);
  readonly state = inject(SearchState);
  readonly filterCategories = FILTER_CATEGORIES;
  readonly loading$ = this.loading.asObservable();
  readonly loadingMore$ = this.loadingMore.asObservable();

  @ViewChild('resultsList') resultsList!: CdkVirtualScrollViewport;

  activeSort = {
    field: 'lastLogin',
    direction: 'asc'
  };

  page = 1;
  pageSize = 25;

  $candidates = this.state.$hits;
  $company = signal<Company | null>(null);

  nextToken: string | null | undefined;

  queryModel = {};

  queryValues: { [key: string]: any[] } = {
    experienceLevel: [],
    locationsOfInterest: [],
    availabilityStatus: [],
    clientPopulations: [],
    environments: [],
    employmentTypes: []
  };

  resultslength: number | undefined;

  async ngOnInit(): Promise<void> {
    const search = await this.searchSvc.getSearchIndex('candidates');

    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ company }) => {
        this.$company.set(company);
      });
  }

  async getResults(nextToken?: string | null): Promise<void> {

  }


  async loadMore(): Promise<void> {
    await this.searchSvc.nextPage();
  }

  sortData(data: any[], sort: any): any[] {
    return sortBy(data, item => new Date(item?.[sort.field]).getTime());
  }
}
