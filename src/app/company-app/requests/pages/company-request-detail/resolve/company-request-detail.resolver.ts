import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';

import { RequestsService } from '../../../../../requests/service/requests.service';
import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { AuthService } from '~auth/auth.service';
import { AuthStore } from '~auth/state/auth.store';
import { filter, firstValueFrom } from 'rxjs';
import isEmpty from 'lodash/isEmpty';

export const CompanyRequestDetailResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authStore = inject(AuthStore);
  const authSvc = inject(AuthService);
  const firestore = inject(Firestore);
  const requestsSvc = inject(RequestsService);
  const { id } = route.params;

  requestsSvc.setShowBackToList(true);
  requestsSvc.setBackToListLink(`/app/company/requests`);

  let companyID = authStore.companyID();

  if (!companyID) {
    companyID = (await firstValueFrom(authSvc.claims$.pipe(filter(claims => !isEmpty(claims)))))?.companyID;
  }

  const requestRef = doc(firestore, `companies/${companyID}/requests/${id}`);
  const requestSnapshot = await getDoc(requestRef);

  const request: any = {
    id: requestSnapshot.id,
    ...requestSnapshot.data()
  };

  if (request?.status === 'Accepted') {
    const candidateRef = doc(firestore, `users/${request.candidateID}`);
    const candidateSnapshot = await getDoc(candidateRef);

    request.candidate = {
      id: candidateSnapshot.id,
      ...candidateSnapshot.data()
    };
  }

  return request;
};
