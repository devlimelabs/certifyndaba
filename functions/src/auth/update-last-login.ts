import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions/v1';
import {
  beforeUserSignedIn,
} from "firebase-functions/v2/identity";

const db = getFirestore();
export const updateUserLastLogin = beforeUserSignedIn(async event => {

  const userRef = db.doc(`users/${event.data.uid}`);

  const userDoc = await userRef.get();

  logger.info('on auth user created event', JSON.stringify(event, null, 2));

  if (!userDoc.exists) {
    logger.error(`User doesn't exist for uid`, event.data.uid);
    return;
  }

  const userUpdate = await userRef.update({
    lastLogin: new Date().getTime()
  });

  logger.info('Updated last login for user', event.data.uid);
  logger.debug('User Update Response:', userUpdate);

  return;
});
