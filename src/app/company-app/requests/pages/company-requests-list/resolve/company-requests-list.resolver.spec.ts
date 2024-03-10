import { TestBed } from '@angular/core/testing';

import { CompanyRequestsListResolver } from './company-requests-list.resolver';

describe('CompanyRequestsListResolver', () => {
  let resolver: CompanyRequestsListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CompanyRequestsListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
