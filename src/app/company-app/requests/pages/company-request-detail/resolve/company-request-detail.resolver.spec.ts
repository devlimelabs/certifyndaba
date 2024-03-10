import { TestBed } from '@angular/core/testing';

import { CompanyRequestDetailResolver } from './company-request-detail.resolver';

describe('CompanyRequestDetailResolver', () => {
  let resolver: CompanyRequestDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CompanyRequestDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
