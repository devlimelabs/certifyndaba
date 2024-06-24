import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';

import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { RequestsStore } from 'src/app/requests/state/requests.state';
import { patchState } from '@ngrx/signals';

export const RequestDetailResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const requestId = route.params?.['id'];
  const companyId = route.params?.['companyId'];

  inject(LayoutService).setRightPanel(false);

  const requestsStore = inject(RequestsStore);

  patchState(requestsStore, {
    showBackToList: true,
    backToListLink: `/app/candidate`,
    requestPageTitle: 'Request Details'
  });

  const requestRef = doc(inject(Firestore), `companies/${companyId}/requests/${requestId}`);
  const requestSnapShot = await getDoc(requestRef);

  return {
    id: requestSnapShot.id,
    ...requestSnapShot.data()
  };
};
