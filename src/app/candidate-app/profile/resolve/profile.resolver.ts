import { inject } from '@angular/core';
import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { ResolveFn } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { AuthService } from '~auth/auth.service';
import { AuthStore } from '~auth/state/auth.store';

export const profileResolver: ResolveFn<any> = async (route, state) => {

  const firestore = inject(Firestore);
  const authStore = inject(AuthStore);
  const authSvc = inject(AuthService);

  let userID = authStore.userId();
  console.log('userID', userID);

  if (!userID) {
    userID = (await firstValueFrom(authSvc.user$.pipe(filter(user => !!user))))?.uid;
  }

  const userRef = doc(firestore, `users/${userID}`);

  const userSnapShot = await getDoc(userRef);

  return {
    id: userSnapShot.id,
    ...userSnapShot.data()
  };
};
