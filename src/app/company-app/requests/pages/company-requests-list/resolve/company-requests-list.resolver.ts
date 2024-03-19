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
import { filter, take } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { Auth, user } from '@angular/fire/auth';


export const CompanyRequestsListResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const requestsSvc = inject(RequestsService);
  const authSvc = inject(AuthService);
  const firestore = inject(Firestore);
  requestsSvc.setShowBackToList(false);
  requestsSvc.setShowRequestButton(false);

  const { status = RequestStatus.Pending } = route.params;

  console.log('authSvc.$companyID()', authSvc.$companyID());
  console.log('authSvc.$user()', authSvc.$user());
  const authUser = await lastValueFrom(user(inject(Auth)).pipe(filter(user => !!user), take(1)));
  console.log('authUser', authUser);


  console.log('authSvc.$user()', authSvc.$user());
  const requestsSnapshot = await getDocs(
    query(
      collection(firestore, `companies/${authSvc.$companyID()}/requests/`),
      where('companyID', '==', authSvc.$companyID()),
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
