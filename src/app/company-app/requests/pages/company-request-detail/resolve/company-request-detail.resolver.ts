import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';

import { RequestsService } from '../../../../../requests/service/requests.service';
import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { AuthService } from '~auth/auth.service';

export const CompanyRequestDetailResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const requestsSvc = inject(RequestsService);
  const { status, id } = route.params;

  requestsSvc.setShowBackToList(true);
  requestsSvc.setBackToListLink(`/app/company/requests`);

  const requestRef = doc(inject(Firestore), `companies/${inject(AuthService).$companyID()}/requests/${id}`);
  const requestSnapShot = await getDoc(requestRef);

  return {
    id: requestSnapShot.id,
    ...requestSnapShot.data()
  };
};
