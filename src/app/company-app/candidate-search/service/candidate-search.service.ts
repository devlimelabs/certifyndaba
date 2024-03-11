import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, getDocs, orderBy, query
} from '@angular/fire/firestore';
import { Candidate } from '~models/candidate';

@Injectable({
  providedIn: 'root'
})
export class CandidateSearchService {

  private firestore = inject(Firestore);

  async listCandidates(): Promise<Candidate[]> {
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
