import {
  DestroyRef, Injectable, afterNextRender, computed, inject, signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Auth, User, authState, signOut, user
} from '@angular/fire/auth';
import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { UserClaims } from '~models/user-claims';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private destroyRef = inject(DestroyRef);
  private firestore = inject(Firestore);
  private router = inject(Router);

  readonly isLoggedIn$ = authState(this.auth).pipe(map((aUser: User | null) => {
    console.log(aUser);
    return !!aUser;
  }));
  private isLoggedIn = signal(false);
  readonly $isLoggedIn = this.isLoggedIn.asReadonly();

  readonly user$ = user(this.auth);
  private user = signal<User | null>(null);
  readonly $user = this.user.asReadonly();

  private claims = signal<UserClaims | null>(null);
  readonly $claims = this.claims.asReadonly();

  readonly $companyID = computed(() => this.$claims()?.companyID);

  readonly $accountType = computed(() => this.$claims()?.accountType);

  readonly $isAdmin = computed(() => this.$claims()?.role === 'admin');

  readonly $isCandidate = computed(() => this.$claims()?.accountType === 'candidate');

  readonly $isCompany = computed(() => this.$claims()?.accountType === 'company');

  private groups = signal<string[]>([]);
  readonly $groups = this.groups.asReadonly();

  constructor() {
    afterNextRender(() => {
      this.isLoggedIn$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(isLoggedIn => this.isLoggedIn.set(isLoggedIn));

      user(this.auth)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          switchMap((authUser: User | null) => {
            console.log('aUser', authUser);
            return authUser?.getIdTokenResult() ?? of(null);
          }),
          switchMap(async (token: any) => {
            console.log('token', token);
            if (token?.claims) {
              this.claims.set({ ...token.claims });
              let userDocPath = `users/${token?.claims?.sub}`;

              if (token.claims?.accountType === 'company') {
                // this.companyID.set(token?.claims?.companyID);
                userDocPath = `companies/${token?.claims?.companyID}/users/${token?.claims?.sub}`;
              }

              const userRef = doc(this.firestore, userDocPath);

              const user = await getDoc(userRef);

              return {
                id: user.id,
                ...user.data()
              };

            } else {
              this.claims.set(null);
              return of(null);
            }
          })
        )
        .subscribe((user: any) => this.user.set(user));
    });
  }


  async signOut(): Promise<void> {
    await signOut(this.auth);

    this.router.navigateByUrl('/');
  }
}

