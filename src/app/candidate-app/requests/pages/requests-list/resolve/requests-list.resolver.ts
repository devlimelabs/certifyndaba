import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';

import {
  Firestore, collectionGroup, getDocs, orderBy, query, where
} from '@angular/fire/firestore';
import { RequestsService } from 'src/app/requests/service/requests.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AuthStore } from '~auth/state/auth.store';

export const RequestsListResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  inject(LayoutService).setRightPanel(true);

  const authStore = inject(AuthStore);
  const requestsSvc = inject(RequestsService);

  requestsSvc.setShowBackToList(false);
  requestsSvc.setShowRequestButton(false);

  const requestsSnapshot = await getDocs(
    query(
      collectionGroup(inject(Firestore), `requests`),
      where('candidateID', '==', authStore.authUser()?.uid),
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
