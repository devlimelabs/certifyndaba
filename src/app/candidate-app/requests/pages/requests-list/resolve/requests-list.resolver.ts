import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot
} from '@angular/router';

import {
  Firestore, collectionGroup, getDocs, orderBy, query, where
} from '@angular/fire/firestore';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AuthStore } from '~auth/state/auth.store';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '~auth/auth.service';
import { RequestsStore } from 'src/app/requests/state/requests.state';
import { patchState } from '@ngrx/signals';

export const RequestsListResolver: ResolveFn<any> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  inject(LayoutService).setRightPanel(true);

  const authStore = inject(AuthStore);
  const authSvc = inject(AuthService);
  const firestore = inject(Firestore);
  const requestsStore = inject(RequestsStore);

  patchState(requestsStore, {
    showBackToList: false,
    showRequestButton: false,
    requestPageTitle: 'Connection Requests'
  });

  const companyId = authStore.companyID();
  let userId = authStore.userId();

  if (!userId) {
    userId = (await firstValueFrom(authSvc.user$.pipe(filter(user => !!user))))?.uid;
  }

  const requestsSnapshot = await getDocs(
    query(
      collectionGroup(firestore, `requests`),
      where('candidateID', '==', userId),
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
