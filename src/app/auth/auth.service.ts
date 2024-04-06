import { HttpClient } from '@angular/common/http';
import {
  DestroyRef, Injectable, inject, signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { map, tap } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { LocalStorage } from '../core/local-storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from './state/auth.store';
import { patchState } from '@ngrx/signals';


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

  readonly isLoggedIn$ = authState(this.auth).pipe(map((aUser: User | null) => !!aUser));

  readonly user$ = user(this.auth);
  readonly claims$: Observable<any>;

  private groups = signal<string[]>([]);
  readonly $groups = this.groups.asReadonly();

  constructor() {
    this.claims$ = authState(this.auth)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(authUser => patchState(this.store, {
          authUser,
          isLoggedIn: !!authUser
        })),
        switchMap(authUser => authUser?.getIdTokenResult() ?? of(null)),
        map((token: IdTokenResult | null) => token?.claims ?? null),
        tap(claims => patchState(this.store, { claims }))
      );

    this.claims$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(async claims => {
          if (!claims) {
            return null;
          }

          let userDocPath = `/users/${claims?.sub}`;
          if (claims?.accountType === 'company') {
            userDocPath = `/companies/${claims?.companyId }/users/${claims?.sub}`;
          }
          const userRef = doc(this.firestore, userDocPath);
          const user = await getDoc(userRef);
          return {
            id: user.id,
            ...user.data()
          };
        })
      )
      .subscribe(user => {
        patchState(this.store, { userProfile: user });
      });
  }

  async initSignIn(provider: AuthProvider, isCompany = false): Promise<any> {
    try {
      const authResult = await signInWithPopup(this.auth, provider);

      const idToken: any = await authResult.user.getIdTokenResult();

      const redirect = this.localStorage.getItem('redirect');

      if (redirect) {
        this.localStorage.removeItem('redirect');
        return this.router.navigateByUrl(redirect);
      }


      if (idToken?.claims?.role === 'admin') {
        this.router.navigateByUrl('/app/admin/verifications');
      } else if (idToken?.claims?.accountType === 'candidate') {
        this.router.navigateByUrl('/app/candidate');
      } else if (idToken?.claims?.accountType === 'company') {
        this.router.navigateByUrl('/app/company/requests');
      }
    } catch (err) {
      console.error('error', err);
      this.snackBar.open('There was an error logging you in!', 'ok', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: [ 'bg-red-50', 'text-red-600' ]
      });

      return false;
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);

    this.router.navigateByUrl('/');
  }
}

