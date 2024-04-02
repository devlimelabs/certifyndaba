import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from "firebase-functions";
import { omit } from 'lodash';
import { logger } from 'firebase-functions/v2';

const auth = getAuth();
const db = getFirestore();
export const addNewUser = functions.auth.user().onCreate(async (user) => {

  functions.logger.log('user', JSON.stringify(user, null, 2));

  const claims: any = {
    accountType: 'candidate'
  };

  if (user?.tenantId) {
    claims.companyID = user.tenantId;
    claims.accountType = 'company'

    const companyUserRef = db.doc(`companies/${user?.tenantId}/users/${user.uid}`);

    return companyUserRef.set({
      id: user.uid,
      ...omit(user, ['metadata', 'providerData', 'customClaims', 'uid']),
      ...claims
    });
  } else {
    const userRef = db.doc(`users/${user.uid}`);

    const userObj = {
      id: user.uid,
      ...omit(user, ['metadata', 'providerData', 'customClaims', 'uid']),
      ...claims
    };
    console.log('new User data', userObj)
    logger.log('logger - new user data', userObj)
    const dbUser = await userRef.set(userObj);

    console.log('new DB User', dbUser)
    logger.log('logger - new DB user', dbUser)
  }

  console.log('adding claims', claims)
  logger.log('logger - adding claims', claims)

  const updateClaimRes = await auth.setCustomUserClaims(user.uid, claims);
  console.log('updateClaimRes', updateClaimRes)
  logger.log('logger - updateClaimRes', updateClaimRes)

  user = await auth.getUser(user.uid);
  console.log('updated Auth User', user)
  logger.log('logger - updated Auth User', user)

  return user;
});
