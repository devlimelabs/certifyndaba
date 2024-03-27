import {
  patchState, signalStore, withComputed, withHooks, withState
} from '@ngrx/signals';
import {
  Auth, IdTokenResult, User, authState
} from '@angular/fire/auth';
import { Candidate } from '~models/candidate';
import { CompanyUser } from '~models/company-user';

import {
  DestroyRef, computed, inject
} from '@angular/core';
import {
  map, switchMap, tap
} from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

type AppAuthState = {
  authUser: User | null;
  claims: any;
  companyID: string | null;
  userProfile: Candidate | CompanyUser | null;
  isAdmin: boolean;
  isCandidate: boolean;
  isCompany: boolean;
  isLoggedIn: boolean;
}

const initialState: AppAuthState = {
  authUser: null,
  claims: null,
  companyID: null,
  userProfile: null,
  isAdmin: false,
  isCandidate: false,
  isCompany: false,
  isLoggedIn: false
};

export const AuthStore = signalStore(
  // 👇 Providing `AuthStore` at the root level.
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ authUser, claims }) => ({
    companyID: computed(() => claims()?.companyID ?? claims()?.companyId),
    isAdmin: computed(() => claims().role = 'admin'),
    isCandidate: computed(() => claims().accountType = 'candidate'),
    isCompany: computed(() => claims().accountType = 'company'),
    isLoggedIn: computed(() => !!authUser())
  })),
  withHooks({
    onInit(store) {
      const auth = inject(Auth);
      const destroyRef = inject(DestroyRef);
      authState(auth)
        .pipe(
          takeUntilDestroyed(destroyRef),
          tap(authUser => patchState(store, { authUser })),
          switchMap(authUser => authUser?.getIdTokenResult() ?? of(null)),
          map((token: IdTokenResult | null) => token?.claims ?? null)
        )
        .subscribe(claims => patchState(store, { claims }));
    }
  })
);
