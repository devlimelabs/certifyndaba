import { TestBed } from '@angular/core/testing';

import { CandidateSearchService } from './candidate-search.service';

describe('CandidateSearchService', () => {
  let service: CandidateSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
