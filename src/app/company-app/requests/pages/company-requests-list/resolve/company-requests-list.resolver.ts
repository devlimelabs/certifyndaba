import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';


import {
  Firestore,
  collection,
  getDocs,
  orderBy,
  query,
  where
} from '@angular/fire/firestore';
import { RequestsService } from 'src/app/requests/service/requests.service';
import { AuthStore } from '~auth/state/auth.store';
import { AuthService } from '~auth/auth.service';
import { filter, firstValueFrom } from 'rxjs';
import isEmpty from 'lodash/isEmpty';


export const CompanyRequestsListResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const requestsSvc = inject(RequestsService);
  const authStore = inject(AuthStore);
  const authSvc = inject(AuthService);
  const firestore = inject(Firestore);

  requestsSvc.setShowBackToList(false);
  requestsSvc.setShowRequestButton(false);

  const requests: any[] = [];

  try {
    let companyID = authStore.companyID();

    if (!companyID) {
      companyID = (await firstValueFrom(authSvc.claims$.pipe(filter(claims => !isEmpty(claims)))))?.companyID;
    }

    const requestsSnapshot = await getDocs(
      query(
        collection(firestore, `companies/${companyID}/requests`),
        where('companyID', '==', companyID),
        orderBy('createdAt', 'desc')
      )
    );

    requestsSnapshot.forEach((doc: any) => {
      requests.push({
        id: doc.id,
        ...doc.data()
      });
    });

  } catch (error) {
    console.log('comapnyRequests', authStore.companyID());
    console.log('error', error);
  }

  return requests;
};
