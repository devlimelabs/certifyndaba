import { TestBed } from '@angular/core/testing';

import { RequestDetailResolver } from './request-detail.resolver';

describe('RequestDetailResolver', () => {
  let resolver: RequestDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RequestDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
