import {
  Host, Inject, Injectable, InjectionToken, signal
} from '@angular/core';
import {
  MeiliSearch, Faceting, Index
} from 'meilisearch';
import { environment } from 'src/environments/environment';
import { SearchState } from '../state/search.state';
import { reject } from 'lodash';


export const ACTIVE_SEARCH_INDEX = new InjectionToken<string>('activeSearchIndex');

@Injectable()
export class SearchService {

  activeIndexName = signal('');

  filterState = {
    facets: {},
    hits: [],
    limit: 1000,
    offset: 0,
    total: 0,
    q: '',
    filters: {}
  };


  client: MeiliSearch;

  faceting!: Faceting;
  index!: Index;

  state: SearchState;


  constructor(@Host() @Inject(SearchState) state: SearchState) {
    this.state = state;
    this.client = new MeiliSearch({
      host:  environment.meilisearch_domain,
      apiKey: environment.meilisearch_apikey
    });
  }

  async facetSearch(facetName: string, query = ''): Promise<any> {
    return this.index.searchForFacetValues({
      facetName,
      facetQuery: query,
      hitsPerPage: 1000,
      page: 1
    });
  }

  async getSearchIndex(index: string): Promise<Index> {
    this.state.set('loading', true);
    this.index = await this.client.getIndex(index);

    console.log('faceting', this.faceting);
    this.state.setIndex(index);

    const search = await this.search();

    this.state.set('loading', false);

    return search;
  }

  async nextPage(): Promise<any> {
    if (this.state.$page() < this.state.$totalPages()) {
      this.state.set('page', this.state.$page() + 1);

      this.search(true);
    }
  }

  async search(appendHits = false): Promise<any> {

    /* Reset page to 1 if results are not being appended */
    if (!appendHits) {
      this.state.set('page', 1);
    }

    console.log('this.state.getSearchFilters()', this.state.getSearchFilters());
    const search: any = await this.index.search(this.state.$q(), this.state.getSearchFilters());
    console.log('search', search);

    this.state.setFacets(search?.facetDistribution);
    this.state.set('totalHits', search?.totalHits);
    this.state.set('totalPages', search?.totalPages);
    this.state.set('processingTimeMs', search.processingTimeMs);

    if (appendHits) {
      this.state.appendHits(search?.hits);
    } else {
      this.state.setHits(search?.hits);
    }

    return search;
  }

  toggleFacetValue(facet: string, value: any): void {
    const facetValues = this.state.$facetValues();

    facetValues[facet] ??= [];

    if (facetValues?.[facet]?.includes(value)) {
      facetValues[facet] = reject(facetValues[facet], v => v === value);

      if (!facetValues[facet]?.length) {
        delete facetValues[facet];
      }
    } else {
      facetValues[facet]?.push(value);
    }

    this.state.setFacetValues(facetValues);
    this.search();
  }
}
