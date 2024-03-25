import { inject } from '@angular/core';
import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { ResolveFn, Router } from '@angular/router';
import {
  filter, firstValueFrom, map, take
} from 'rxjs';
import { AuthService } from '~auth/auth.service';

export const profileResolver: ResolveFn<any> = async (route, state) => {
  const authSvc = inject(AuthService);
  const firestore = inject(Firestore);

  const userID = await firstValueFrom(authSvc.user$.pipe(filter(user => !!user),take(1),map(user => user?.uid)));

  if (!userID) {
    return inject(Router).createUrlTree([ '/sign-in' ]);
  }

  const userRef = doc(firestore, `users/${userID}`);

  const userSnapShot = await getDoc(userRef);

  return {
    id: userSnapShot.id,
    ...userSnapShot.data()
  };
};
