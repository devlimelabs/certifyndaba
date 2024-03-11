import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';


import {
  Firestore, collection, getDocs, orderBy, query, where
} from '@angular/fire/firestore';
import { AuthService } from '~auth/auth.service';
import { RequestsService } from 'src/app/requests/service/requests.service';
import { RequestStatus } from '~models/request-status';


export const CompanyRequestsListResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const requestsSvc = inject(RequestsService);

  requestsSvc.setShowBackToList(false);
  requestsSvc.setShowRequestButton(false);

  const { status = RequestStatus.Pending } = route.params;

  const requestsSnapshot = await getDocs(
    query(
      collection(inject(Firestore), `companies/${inject(AuthService).$companyID()}/requests/`),
      where('companyID', '==', inject(AuthService).$companyID()),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )
  );

  const requests: any[] = [];

  requestsSnapshot.forEach((doc: any) => {
    requests.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return requests;
};
