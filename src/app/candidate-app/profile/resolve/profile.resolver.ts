import { inject } from '@angular/core';
import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { ResolveFn } from '@angular/router';
import { AuthService } from '~auth/auth.service';

export const profileResolver: ResolveFn<any> = async (route, state) => {
  const userId = inject(AuthService).$user();

  const userRef = doc(inject(Firestore), `users/${userId}`);

  const userSnapShot = await getDoc(userRef);

  return {
    id: userSnapShot.id,
    ...userSnapShot.data()
  };
};
