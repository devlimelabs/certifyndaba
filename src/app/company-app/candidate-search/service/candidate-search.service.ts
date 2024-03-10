import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, orderBy, query } from '@angular/fire/firestore';
import { ListCandidatesQuery } from 'graphql-api';

@Injectable({
  providedIn: 'root'
})
export class CandidateSearchService {

  private firestore = inject(Firestore);

  async listCandidates(): Promise<ListCandidatesQuery> {
    const candidatesSnapshot = await getDocs(
      query(
        collection(this.firestore, `users`),
        orderBy('lastLogin', 'desc')
      )
    );

    const candidates: any[] = [];

    candidatesSnapshot.forEach((doc: any) => {
      candidates.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return candidates;
  }

}
