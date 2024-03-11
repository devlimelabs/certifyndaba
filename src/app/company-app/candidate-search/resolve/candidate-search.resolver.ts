import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { SearchService } from 'src/app/search/services/search.service';

export const candidateSearchResolver: ResolveFn<any> = async (route, state) => {
  return inject(SearchService).getSearchIndex('candidates');
};
