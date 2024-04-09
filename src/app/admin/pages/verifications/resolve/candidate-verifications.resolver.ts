import { inject } from '@angular/core';
import {
  Firestore, collection, getDocs, orderBy, query, where
} from '@angular/fire/firestore';
import { ResolveFn } from '@angular/router';

export const candidateVerificationsResolver: ResolveFn<any[]> = async (route, state) => {
  const firestore = inject(Firestore);

  const unverifiedUsersSnapshot = await getDocs(
    query(
      collection(firestore, `users`),
      where('status', '==', 'unverified'),
      orderBy('createdAt', 'desc')
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
