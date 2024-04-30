import { PromisePool } from '@supercharge/promise-pool';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';
// Run once a day at midnight, to process profile emails
// Manually run the task here https://console.cloud.google.com/cloudscheduler
exports.profileReminders = onSchedule("every day 00:00", async (event) => {
  const db = admin.firestore();

  const userProfilesSnapshot = await db.collection('users').where('certificationNumber', '==', '').get();
  const userProfiles = userProfilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Use a pool so that we delete maximum `MAX_CONCURRENT` users in parallel.
  const { results, errors } = await PromisePool
    .withConcurrency(3)
    .for(userProfiles)
    .process(async (userProfile: any, index, pool) => {
      console.log('userProfile', userProfile);
      if (!userProfile.certificationNumber) {

      }
    });

    if (errors.length > 0) {
      logger.error('you\'ve got errors:', errors);
    }

    if (results.length > 0) {
      logger.info('you\'ve got results:', results);
    }
});
