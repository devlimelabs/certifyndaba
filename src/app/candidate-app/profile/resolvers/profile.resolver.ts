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

  let userId = authStore.userId();

  if (!userId) {
    userId = (await firstValueFrom(authSvc.user$.pipe(filter(user => !!user))))?.uid;
  }

  const userRef = doc(firestore, `users/${userId}`);

  const userSnapShot = await getDoc(userRef);

  return {
    id: userSnapShot.id,
    ...userSnapShot.data()
  };
};
