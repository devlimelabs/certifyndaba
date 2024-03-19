import { getFirestore } from 'firebase-admin/firestore';
import {
  beforeUserSignedIn,
} from "firebase-functions/v2/identity";

const db = getFirestore();
export const updateUserLastLogin = beforeUserSignedIn(async event => {

  const userRef = db.doc(`users/${event.data.uid}`);

  await userRef.update({
    lastLogin: new Date().getTime()
  });

});
