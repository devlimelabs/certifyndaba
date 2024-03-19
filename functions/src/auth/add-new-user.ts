
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from "firebase-functions";

const db = getFirestore();
export const addNewUser = functions.auth.user().onCreate((user) => {

  const userRef = db.doc(`users/${user.uid}`);
  const providerId = user.providerData?.[0]?.providerId;

  functions.logger.log('user', user);

  let verified = true;

  if (providerId === 'password') {
    verified = false;
  }

  return userRef.create({
    ...user,
    verified,
    accountType: 'candidate'
  });
});
