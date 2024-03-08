import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';

import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { RequestsService } from 'src/app/requests/service/requests.service';

export const RequestDetailResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const requestId = route.params?.['id'];

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
