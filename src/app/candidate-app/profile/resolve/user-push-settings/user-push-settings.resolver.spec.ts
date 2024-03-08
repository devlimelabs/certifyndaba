import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userPushSettingsResolver } from './user-push-settings.resolver';

describe('userPushSettingsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
    TestBed.runInInjectionContext(() => userPushSettingsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
