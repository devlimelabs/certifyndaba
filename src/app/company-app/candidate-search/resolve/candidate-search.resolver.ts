import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ListCandidatesQuery } from 'graphql-api';

import { CandidateSearchService } from '../service/candidate-search.service';

export const candidateSearchResolver: ResolveFn<ListCandidatesQuery> = async (route, state) => {
  return (await inject(CandidateSearchService).listCandidates({ status: { eq: 'verified' } }, 25));
};
