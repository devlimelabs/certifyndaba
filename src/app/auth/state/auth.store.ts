import {
  signalStore, withComputed, withState
} from '@ngrx/signals';
import { User } from '@angular/fire/auth';
import { Candidate } from '~models/candidate';
import { CompanyUser } from '~models/company-user';

import { computed } from '@angular/core';

type AppAuthState = {
  accountType: 'candidate' | 'company' | 'admin' | null;
  authUser: User | null;
  claims: any;
  companyID: string | null;
  loginMessage: string | null;
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
  loginMessage: null,
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
    companyID: computed(() => claims()?.companyID ?? null),
    isAdmin: computed(() => claims()?.role === 'admin'),
    isCandidate: computed(() => claims()?.accountType === 'candidate'),
    isCompany: computed(() => claims()?.accountType === 'company'),
    userId: computed(() => authUser()?.uid)
  }))
);
