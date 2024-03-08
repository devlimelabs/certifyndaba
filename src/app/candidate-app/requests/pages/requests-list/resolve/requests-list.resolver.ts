import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';

import {
  Firestore, collection, getDocs, orderBy, query, where
} from '@angular/fire/firestore';
import { AuthService } from '~auth/auth.service';
import { RequestsService } from 'src/app/requests/service/requests.service';

export const RequestsListResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const requestsSvc = inject(RequestsService);
  requestsSvc.setShowBackToList(false);
  requestsSvc.setShowRequestButton(false);

  const requestsSnapshot = await getDocs(
    query(
      collection(inject(Firestore), `requests`),
      where('candidateID', '==', inject(AuthService)?.$user()?.uid),
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
