import { beforeUserCreated, beforeUserSignedIn } from 'firebase-functions/v2/identity';
import { logger } from 'firebase-functions/v2';
import { getFirestore } from 'firebase-admin/firestore';
import { BeforeCreateResponse, BeforeSignInResponse } from 'firebase-functions/lib/common/providers/identity';

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

export const addCustomClaims = beforeUserCreated(async (event): Promise<any> => {
  console.log('before user created event', JSON.stringify(event, null, 2));
  logger.log('logger - before user created event', JSON.stringify(event, null, 2));

  const user = event.data;
  console.log('user', JSON.stringify(user, null, 2));
  logger.log('logger - user', JSON.stringify(user, null, 2));

  if (event?.data?.uid) {
    const claims: any = {
      accountType: 'candidate'
    };

    if (event.data.tenantId || event?.resource.name.includes('tenants')) {
      const resourceParts = event?.resource.name.split('/');
      claims.companyID = resourceParts[resourceParts.length - 1];
      claims.accountType = 'company'

      const companyUserRef = db.doc(`companies/${user?.tenantId}/users/${user.uid}`);

      const companyUser = await companyUserRef.set({
        email: user.email,
        phone: user.phoneNumber,
        displayName: user?.displayName ?? user.email,
        profileImage: user.photoURL,
        ...claims
      });

      logger.log('New Company User Profile', companyUser)
    } else {
      const userRef = db.doc(`users/${user.uid}`);

      const userProfile = await userRef.set({
        email: user.email,
        phone: user.phoneNumber,
        displayName: user?.displayName ?? user.email,
        profileImage: user.photoURL,
        status: 'unverified',
        ...claims
      });

      console.log('new DB User', userProfile)
      logger.log('logger - new DB user', userProfile)
    }

    return {
      customClaims: claims
    } as BeforeCreateResponse;
  }

  return;
});

export const updateLastLogin = beforeUserSignedIn((event) => {
  console.log('before signin event', JSON.stringify(event, null, 2));
  logger.log('logger - before signin event', JSON.stringify(event, null, 2));

  // update user lastLogin timestamp
  const userRef = db.doc(`users/${event.data.uid}`);

  userRef.get()
    .then(userDoc => {
      logger.info('before user signed in event', JSON.stringify(event, null, 2));

      if (!userDoc.exists) {
        logger.error(`User doesn't exist for uid`, event.data.uid);
        return;
      } else {
        return userRef.update({
          lastLogin: new Date().getTime()
        });
      }

    }).then((userUpdate) => {
      logger.info('Updated last login for user', event.data.uid);
      logger.debug('User Update Response:', userUpdate);
    });

  // copy claims to session claims (not sure if we really need this)
  if (event.credential) {
      return {
          // Copy role and groups to token claims. These will not be persisted.
          sessionClaims: {
              accountType: event?.credential?.claims?.customClaims.accountType
          },
      } as BeforeSignInResponse;
  }

  return;
});
