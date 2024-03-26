import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';

import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { RequestsService } from 'src/app/requests/service/requests.service';
import { LayoutService } from 'src/app/layout/service/layout.service';

export const RequestDetailResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const requestId = route.params?.['id'];

  inject(LayoutService).setRightPanel(false);

  const requestsSvc = inject(RequestsService);

  requestsSvc.setShowBackToList(true);
  requestsSvc.setBackToListLink('/app/candidate/requests');

  const requestRef = doc(inject(Firestore), `requests/${requestId}`);
  const requestSnapShot = await getDoc(requestRef);

  return {
    id: requestSnapShot.id,
    ...requestSnapShot.data()
  };
};
