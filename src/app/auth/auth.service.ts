import {
  Injectable, inject, signal
} from '@angular/core';
import {
  Auth, User, authState, signOut, user
} from '@angular/fire/auth';
import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs/operators';
import {
  filter, switchMap, take
} from 'rxjs/operators';
@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  private isLoggedIn = signal(false);
  readonly $isLoggedIn = this.isLoggedIn.asReadonly();
  isLoggedIn$ = authState(this.auth).pipe(map((aUser: User | null) => !!aUser));

  private user = signal<User | null>(null);
  readonly $user = this.user.asReadonly();
  user$ = user(this.auth);


  private _authState = signal<User | null>(null);
  readonly $authState = this._authState.asReadonly();
  authState$ = authState(this.auth);


  private appUser = signal<any>(null);
  readonly $appUser = this.appUser.asReadonly();
  private groups = signal<string[]>([]);
  readonly $groups = this.groups.asReadonly();

  constructor() {
    this.isLoggedIn$
      .pipe(untilDestroyed(this))
      .subscribe(isLoggedIn => this.isLoggedIn.set(isLoggedIn));

    // this.authState$
    //   .pipe(untilDestroyed(this))
    //   .subscribe(authState => {
    //     console.log('authState', authState);
    //     this._authState.set(authState);
    //   });
    this.user$
      .pipe(untilDestroyed(this))
      .subscribe(user => this.user.set(user));

    this.user$
      .pipe(
        untilDestroyed(this),
        filter((aUser: User | null) => !!aUser),
        take(1),
        switchMap(async (aUser: User | null) => {
          const userRef = doc(this.firestore, `users/${aUser?.uid}`);
          const user = await getDoc(userRef);
          console.log('user', user);

          return user;
        })
      )
      .subscribe(user => {
        this.appUser.set(user);
      });
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);

    this.router.navigateByUrl('/');
  }
}
