import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import {
  Firestore, doc, getDoc
} from '@angular/fire/firestore';
import { AuthService } from '~auth/auth.service';
import { AuthStore } from '~auth/state/auth.store';
import { filter, firstValueFrom } from 'rxjs';
import isEmpty from 'lodash/isEmpty';
import MeiliSearch from 'meilisearch';
import { environment } from '~env';
import { Candidate } from '~models/candidate';


export const requestCandidateResolver: ResolveFn<Candidate> = async (route, state) => {
  const authStore = inject(AuthStore);
  const authSvc = inject(AuthService);
  const firestore = inject(Firestore);
  const { id } = route.params;

  let companyID = authStore.companyID();

  if (!companyID) {
    companyID = (await firstValueFrom(authSvc.claims$.pipe(filter(claims => !isEmpty(claims)))))?.companyID;
  }

  const requestRef = doc(firestore, `companies/${companyID}/requests/${id}`);
  const requestSnapshot = await getDoc(requestRef);

  const request = requestSnapshot.data();

  if (request?.['status'] === 'Accepted') {
    const candidateRef = doc(firestore, `users/${request?.['candidateID']}`);
    const candidateSnapshot = await getDoc(candidateRef);

    return {
      id: candidateSnapshot.id,
      ...candidateSnapshot.data()
    } as Candidate;
  } else {
    /* get candidate from meilisearch */
    const client = new MeiliSearch({
      host:  environment.meilisearch_domain,
      apiKey: environment.meilisearch_apikey
    });

    const candidate = await client.index(environment.meilisearch_index).getDocument(request?.['candidateID']);

    return candidate as Candidate;
  }
};
