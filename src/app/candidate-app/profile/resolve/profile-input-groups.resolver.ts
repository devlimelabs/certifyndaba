import { inject } from '@angular/core';
import {
  Firestore, collection, getDocs
} from '@angular/fire/firestore';
import { ResolveFn } from '@angular/router';
import sortBy from 'lodash/sortBy';
import { InputGroup } from 'src/app/forms/forms';

export const profileInputGroupsResolver: ResolveFn<InputGroup[]> = async (route, state) => {

  const firestore = inject(Firestore);

  const inputGroupsRef = collection(firestore, `profile-input-groups`);

  const inputGroupsSnapshot = await getDocs(inputGroupsRef);

  const inputGroups: any[] = [];

  inputGroupsSnapshot.forEach((doc: any) => {
    const data = doc.data();

    data.inputs = sortBy(data.inputs, 'order');

    inputGroups.push({
      id: doc.id,
      ...data
    });
  });


  return sortBy(inputGroups, 'order');
};
