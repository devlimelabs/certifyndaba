import { TestBed } from '@angular/core/testing';

import { RequestsListResolver } from './requests-list.resolver';

describe('RequestsListResolver', () => {
  let resolver: RequestsListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RequestsListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
