import { inject } from '@angular/core';
import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import type { ResolveFn } from '@angular/router';
import isEmpty from 'lodash/isEmpty';
import { filter, firstValueFrom } from 'rxjs';
import { AuthService } from '~auth/auth.service';
import { AuthStore } from '~auth/state/auth.store';

export const companyInfoResolver: ResolveFn<any> = async (route, state) => {
  const authStore = inject(AuthStore);
  const authSvc = inject(AuthService);
  const firestore = inject(Firestore);

  let companyID = authStore.companyID();

  if (!companyID) {
    companyID = (await firstValueFrom(authSvc.claims$.pipe(filter(claims => !isEmpty(claims)))))?.companyID;
  }

  const companyRef = doc(firestore, `companies/${companyID}`);

  const companySnapshot = await getDoc(companyRef);

  return {
    id: companySnapshot.id,
    ...companySnapshot.data()
  };
};
