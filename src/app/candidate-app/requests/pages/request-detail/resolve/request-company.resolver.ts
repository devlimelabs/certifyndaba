import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { RequestsStore } from 'src/app/requests/state/requests.state';
import { patchState } from '@ngrx/signals';
import { Company } from '~models/company';


export const requestCompanyResolver: ResolveFn<Company> = async (route, state) => {
  const requestId = route.params?.['id'];
  const companyId = route.params?.['companyId'];

  inject(LayoutService).setRightPanel(false);

  const requestsStore = inject(RequestsStore);

  patchState(requestsStore, {
    showBackToList: true,
    backToListLink: `/app/candidate`,
    requestPageTitle: 'Request Details'
  });

  const companyRef = doc(inject(Firestore), `companies/${companyId}`);
  const companySnapshot = await getDoc(companyRef);

  return {
    id: companySnapshot.id,
    ...companySnapshot.data()
  } as Company;
};
