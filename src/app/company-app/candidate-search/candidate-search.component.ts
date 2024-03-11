import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  NgZone,
  OnInit,
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
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { SearchHeaderComponent } from './components/search-header/search-header.component';
import { FILTER_CATEGORIES } from './constants/filter-categories';
import { CandidateSearchService } from './service/candidate-search.service';
import { Candidate } from '~models/candidate';
import { Company } from '~models/company';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService } from 'src/app/search/services/search.service';
import { SearchState } from 'src/app/search/state/search.state';


@Component({
  standalone: true,
  imports: [
    CandidateListItemComponent,
    CommonModule,
    FilterPanelComponent,
    MatMenuModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    ScrollingModule,
    SearchHeaderComponent
  ],
  providers: [ SearchService, SearchState ],
  templateUrl: './candidate-search.component.html',
  styleUrls: [ './candidate-search.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateSearchComponent implements OnInit, AfterViewInit {

  private candidateSearchSvc = inject(CandidateSearchService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private ngZone = inject(NgZone);
  private route = inject(ActivatedRoute);
  private toast = inject(HotToastService);
  private loading = new BehaviorSubject<boolean>(false);
  private loadingMore = new BehaviorSubject<boolean>(false);

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

  candidates: Candidate[] = [];
  company!: Company;
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

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ candidates, company }) => {
        this.candidates = candidates;
        this.company = company;
        this.cdr.markForCheck();
      });
  }

  private buildQueryModel(queryValues: { [key: string]: any[] }): any {

  }

  async filter(property: string, values: string[]): Promise<void> {
    this.nextToken = undefined;
    this.page = 1;
    this.queryValues[property] = values;
    this.queryModel = this.buildQueryModel(this.queryValues);

    this.resultsList.scrollToIndex(0);
    await this.getResults();
  }

  async getResults(nextToken?: string | null): Promise<void> {
    let queryResults;

    try {
      if (nextToken) {
        this.loadingMore.next(true);

        queryResults = await this.candidateSearchSvc.listCandidates(this.queryModel, this.pageSize, nextToken);

        this.candidates = [ ...this.candidates, ...(queryResults.items as Candidate[]) ];
      } else {
        this.loading.next(true);
        queryResults = await this.candidateSearchSvc.listCandidates(this.queryModel, this.pageSize);

        this.candidates = [ ...(queryResults.items as Candidate[]) ];
      }


      this.nextToken = queryResults.nextToken;

      if (this.nextToken !== null && this.candidates.length < (this.page * this.pageSize)) {
        this.loadingMore.next(true);
        this.getResults(this.nextToken);
      } else {
        this.loadingMore.next(false);
      }

    } catch (err) {
      console.error('error', err);
      this.toast.error('There was an error retrieving the results. Please try again. If issues persist please contact support');
    }

    this.loading.next(false);
  }


  async loadMore(): Promise<void> {
    this.page = this.page + 1;
    await this.getResults(this.nextToken);
  }

  sortData(data: any[], sort: any): any[] {
    return sortBy(data, item => new Date(item?.[sort.field]).getTime());
  }
}
