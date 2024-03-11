import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl, FormsModule, ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { showHideVertical } from '~animations/show-hide-vertical';
import { TippyDirective } from '@ngneat/helipopper';
import { StartCasePipe } from '~shared/start-case/start-case.pipe';
import { SearchState } from '~search/state/search.state';
import { SearchService } from '~search/services/search.service';
import {
  debounceTime, startWith, switchMap
} from 'rxjs';


@Component({
  selector: 'app-refinement-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    ReactiveFormsModule,
    StartCasePipe,
    TippyDirective
  ],
  templateUrl: './refinement-list.component.html',
  styleUrls: [ './refinement-list.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ showHideVertical('300') ]
})
export class RefinementListComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  searchSvc = inject(SearchService);
  state = inject(SearchState);

  attribute = input('');

  @Input() showByDefault = false;

  show = signal(false);

  viewAll = input(true);

  @Input() label = '';

  @Input() limit = 5;

  @Input() searchable = false;

  @Input() searchPlaceholder = '';

  expandIcon = computed(() => (this.show() ? 'expand_less' : 'expand_more'));
  expandIconTooltip = computed(() => (this.show() ? 'Hide ' : 'Show ') + (this.label || this.attribute() + 's'));

  facetOptions = computed(() => this.state.$facets()?.[this.attribute()] ?? []);

  facetValues = computed(() => this.state.$facetValues()?.[this.attribute()] ?? []);

  facetCtrl = new FormControl('');

  facetHits = signal<any[]>([]);

  showSearchView = signal(false);

  searchIcon = computed(() => this.showSearchView() ? 'search_off' : 'search');
  searchIconTooltip = computed(() => this.showSearchView() ? 'Close Filter Search' : 'Search Filters');

  ngOnInit() {
    if (this.showByDefault) {
      this.show.set(true);
    }

    this.facetCtrl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(''),
        debounceTime(300),
        switchMap((query: string | null) => this.searchSvc.facetSearch(this.attribute(), query ?? ''))
      )
      .subscribe(facetValues => {
        console.log('facetValues', facetValues);
        this.facetHits.set(facetValues.facetHits);
      });
  }

  clearSearch(): void {
    this.facetCtrl.setValue('');
    this.facetHits.set(this.state.$facets());

  }

  showAll() {

  }

  toggleDisplay(): void {
    this.show.set(!this.show());
  }

  async toggleFacetValue(value: any): Promise<void> {
    const facetSearch = await this.searchSvc.toggleFacetValue(this.attribute(), value);
    console.log('facetSearch', facetSearch);
  }

  toggleSearchView(): void {
    this.showSearchView.set(!this.showSearchView());
    if (this.showSearchView()) {
      this.show.set(true);

    }
  }

  viewAllFacets(): void {

  }
}
