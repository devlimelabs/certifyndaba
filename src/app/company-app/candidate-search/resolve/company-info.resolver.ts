import { inject } from '@angular/core';
import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import type { ResolveFn } from '@angular/router';
import { AuthService } from '~auth/auth.service';

export const companyInfoResolver: ResolveFn<any> = async (route, state) => {
  const firestore = inject(Firestore);

  const requestRef = doc(firestore, `companies/${inject(AuthService).$companyID()}`);

  const requestSnapShot = await getDoc(requestRef);

  return {
    id: requestSnapShot.id,
    ...requestSnapShot.data()
  };
};
