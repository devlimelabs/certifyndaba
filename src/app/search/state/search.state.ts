import {
  Injectable, WritableSignal, signal
} from '@angular/core';
import { map } from 'lodash';
import reduce from 'lodash/reduce';

@Injectable()
export class SearchState {

  readonly facets = signal<any>({});
  readonly facetValues = signal<{ [key: string]: any[] }>({});
  readonly hits = signal<any>([]);
  readonly index = signal('');
  readonly hitsPerPage = signal<number>(1000);
  readonly loading = signal<boolean>(false);
  readonly page = signal<number>(1);
  readonly processingTimeMs = signal<number>(0);
  readonly q = signal<string>('');
  readonly totalHits = signal<number>(0);
  readonly totalPages = signal<number>(0);

  readonly $facets = this.facets.asReadonly();
  readonly $facetValues = this.facetValues.asReadonly();
  readonly $hits = this.hits.asReadonly();
  readonly $index = this.index.asReadonly();
  readonly $page = this.page.asReadonly();
  readonly $hitsPerPage = this.hitsPerPage.asReadonly();
  readonly $q = this.q.asReadonly();
  readonly $loading = this.loading.asReadonly();
  readonly $processingTimeMs = this.processingTimeMs.asReadonly();
  readonly $totalHits = this.totalHits.asReadonly();
  readonly $totalPages = this.totalPages.asReadonly();


  getSearchFilters(): any {
    const filter = reduce(this.$facetValues(), (filterString, values, key) => {
      if (filterString.length) {
        filterString += ' AND ';
      }

      values = map(values, value => value.includes('"') ? value.replace(/"/g, '\\"') : value);
      filterString += `${key} = "${values.join('" OR "')}"`;

      return filterString;
    }, ``);

    return {
      facets: [ '*' ],
      filter,
      page: this.$page(),
      hitsPerPage: this.$hitsPerPage(),
      limit: 1000
    };
  }

  set<K extends keyof SearchState>(key: K, value: any): void {
    (this[key] as WritableSignal<any>).set(value);
  }

  setQuery(query: string) {
    this.q.set(query);
  }

  setFacets(facets: any) {
    this.facets.set(facets);
  }

  setFacetValues(facetValues: any) {
    this.facetValues.set(facetValues);
  }

  setHits(hits: any) {
    this.hits.set(hits);
  }

  setIndex(index: string) {
    this.index.set(index);
  }

  setQ(q: string) {
    this.q.set(q);
  }

  setTotalHits(totalHits: number) {
    this.totalHits.set(totalHits);
  }

  appendHits(hits: any[]) {
    this.hits.set([ ...this.$hits(), ...hits ]);
  }
}
