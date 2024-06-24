import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';

import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { AuthService } from '~auth/auth.service';
import { AuthStore } from '~auth/state/auth.store';
import { filter, firstValueFrom } from 'rxjs';
import isEmpty from 'lodash/isEmpty';
import { RequestsStore } from 'src/app/requests/state/requests.state';
import { patchState } from '@ngrx/signals';

export const CompanyRequestDetailResolver: ResolveFn<Request> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authStore = inject(AuthStore);
  const authSvc = inject(AuthService);
  const firestore = inject(Firestore);
  const requestsStore = inject(RequestsStore);
  const { id } = route.params;

  patchState(requestsStore, {
    showBackToList: true,
    showRequestButton: false,
    backToListLink: `/app/company/requests`,
    requestPageTitle: 'Request Details'
  });

  let companyID = authStore.companyID();

  if (!companyID) {
    companyID = (await firstValueFrom(authSvc.claims$.pipe(filter(claims => !isEmpty(claims)))))?.companyID;
  }

  const requestRef = doc(firestore, `companies/${companyID}/requests/${id}`);
  const requestSnapshot: any = await getDoc(requestRef);

  return {
    id: requestSnapshot.id,
    ...requestSnapshot.data()
  } as Request;
};
