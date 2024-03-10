import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { candidateSearchResolver } from './candidate-search.resolver';

describe('candidateSearchResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
    TestBed.runInInjectionContext(() => candidateSearchResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
