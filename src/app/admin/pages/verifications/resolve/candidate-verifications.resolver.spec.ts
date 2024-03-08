import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { candidateVerificationsResolver } from './candidate-verifications.resolver';

describe('candidateVerificationsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
    TestBed.runInInjectionContext(() => candidateVerificationsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
