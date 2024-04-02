import {
  patchState, signalStore, withComputed, withHooks, withState
} from '@ngrx/signals';
import { Auth, User, authState } from '@angular/fire/auth';
import { Candidate } from '~models/candidate';
import { CompanyUser } from '~models/company-user';

import {
  DestroyRef, computed, inject
} from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';

type AppAuthState = {
  accountType: 'candidate' | 'company' | 'admin' | null;
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
  accountType: null,
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
    accountType: computed(() => claims()?.accountType),
    companyID: computed(() => claims()?.companyID ?? claims()?.companyId ?? null),
    isAdmin: computed(() => claims()?.role === 'admin'),
    isCandidate: computed(() => claims()?.accountType === 'candidate'),
    isCompany: computed(() => claims()?.accountType === 'company'),
    isLoggedIn: computed(() => !!authUser()),
    userId: computed(() => authUser()?.uid)
  })),
  withHooks({
    onInit(store) {
      const auth = inject(Auth);
      const firestore = inject(Firestore);
      const destroyRef = inject(DestroyRef);

      authState(auth)
        .pipe(
          takeUntilDestroyed(destroyRef),
          tap(authUser => patchState(store, { authUser })),
          switchMap(authUser => authUser?.getIdTokenResult() ?? of(null)),
          map((token: any) => token?.claims ?? null),
          tap(claims => patchState(store, { claims })),
          switchMap(claims => {
            console.log('claims in store hook', claims);
            let userDocPath = `users/${claims?.sub}`;

            if (claims?.accountType === 'company') {
              userDocPath = `companies/${claims?.companyId }/users/${claims?.sub}`;
            }

            const userRef = doc(firestore, userDocPath);

            return getDoc(userRef);
          }),
          map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
        .subscribe(user => patchState(store, { userProfile: user }));
    }
  })
);
