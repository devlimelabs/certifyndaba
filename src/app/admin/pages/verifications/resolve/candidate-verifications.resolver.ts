import { inject } from '@angular/core';
import {
  Firestore, and, collection, getDocs, or, query, where
} from '@angular/fire/firestore';
import { ResolveFn } from '@angular/router';

export const candidateVerificationsResolver: ResolveFn<any[]> = async (route, state) => {
  const firestore = inject(Firestore);

  const unverifiedUsersSnapshot = await getDocs(
    query(
      collection(firestore, `users`),
      and(
        where('status', '==', 'unverified'),
        or(
          where('certificationNumber', '>=', '1'),
          where('certificationNumber', '>=', '0'),
          where('certificationNumber', '>=', 'RBT'),
          where('experienceLevel', '==', 'NONE'),
          where('experienceLevel', '==', 'BT')
        )
      )
    )
  );

  const unverifiedUsers: any[] = [];

  unverifiedUsersSnapshot.forEach((doc: any) => {
    unverifiedUsers.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return unverifiedUsers;
};
