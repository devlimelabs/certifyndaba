import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';


import {
  Firestore, collection, getDocs, orderBy, query
} from '@angular/fire/firestore';
import { RequestsService } from 'src/app/requests/service/requests.service';
import { AuthStore } from '~auth/state/auth.store';


export const CompanyRequestsListResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const requestsSvc = inject(RequestsService);
  const authStore = inject(AuthStore);
  const firestore = inject(Firestore);

  requestsSvc.setShowBackToList(false);
  requestsSvc.setShowRequestButton(false);

  const requestsSnapshot = await getDocs(
    query(
      collection(firestore, `companies/${authStore.companyID()}/requests/`),
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
