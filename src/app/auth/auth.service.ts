import { HttpClient } from '@angular/common/http';
import {
  DestroyRef, Injectable, Signal, computed, inject, signal
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  AuthProvider,
  IdTokenResult,
  User,
  authState,
  signInWithPopup,
  signOut,
  user
} from '@angular/fire/auth';
import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { UserClaims } from '~models/user-claims';
import { LocalStorage } from '../core/local-storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from './state/auth.store';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private store = inject(AuthStore);
  private destroyRef = inject(DestroyRef);
  private firestore = inject(Firestore);
  private http = inject(HttpClient);
  private localStorage = inject(LocalStorage);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly isLoggedIn$ = authState(this.auth).pipe(map((aUser: User | null) => {
    console.log(aUser);
    return !!aUser;
  }));
  private isLoggedIn = signal(false);
  readonly $isLoggedIn = this.isLoggedIn.asReadonly();

  readonly user$ = user(this.auth);
  readonly $user: Signal<User | null>;

  readonly userProfile$: Observable<any>;
  readonly $userProfile: Signal<any>;
  readonly claims$: Observable<any>;
  readonly $claims: Signal<UserClaims | null>;

  readonly $companyID = computed(() => this.$claims()?.companyID);

  readonly $accountType = computed(() => this.$claims()?.accountType);

  readonly $isAdmin = computed(() => this.$claims()?.role === 'admin');

  readonly $isCandidate = computed(() => this.$claims()?.accountType === 'candidate');

  readonly $isCompany = computed(() => this.$claims()?.accountType === 'company');

  private groups = signal<string[]>([]);
  readonly $groups = this.groups.asReadonly();

  constructor() {
    this.isLoggedIn$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isLoggedIn => this.isLoggedIn.set(isLoggedIn));

    this.claims$ = authState(this.auth)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(authUser => authUser?.getIdTokenResult() ?? of(null)),
        map((token: IdTokenResult | null) => token?.claims ?? null)
      );

    this.userProfile$ = this.claims$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((claims: any) => {
          let userDocPath = `users/${claims?.sub}`;

          if (claims?.accountType === 'company') {
            userDocPath = `companies/${claims?.companyId }/users/${claims?.sub}`;
          }

          const userRef = doc(this.firestore, userDocPath);

          return getDoc(userRef);
        }),
        map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );

    this.$user = toSignal(user(this.auth), { initialValue: null });
    this.$userProfile = toSignal(this.userProfile$, { initialValue: null });
    this.$claims = toSignal(this.claims$, { initialValue: null });
  }

  async initSignIn(provider: AuthProvider, isCompany = false): Promise<any> {
    try {
      const authResult = await signInWithPopup(this.auth, provider);
      console.log('authResult', authResult);

      const idToken: any = await authResult.user.getIdTokenResult();

      const redirect = this.localStorage.getItem('redirect');
      console.log('redirect', redirect);

      if (redirect) {
        this.localStorage.removeItem('redirect');
        return this.router.navigateByUrl(redirect);
      }

      console.log('after login accountType:', this.store.accountType());
      console.log('after login idToken', idToken );

      if (idToken?.claims?.role === 'admin') {
        this.router.navigateByUrl('/app/admin/verifications');
      } else if (idToken?.claims?.accountType === 'candidate') {
        this.router.navigateByUrl('/app/candidate/profile');
      } else if (idToken?.claims?.accountType === 'company') {
        this.router.navigateByUrl('/app/company/requests');
      }
    } catch (err) {
      console.error('error', err);
      this.snackBar.open('There was an error logging you in!', 'ok', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'bg-red-50 text-red-600'
      });

      return false;
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);

    this.router.navigateByUrl('/');
  }
}

