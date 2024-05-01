import { PromisePool } from '@supercharge/promise-pool';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';
// Run once a day at midnight, to process profile emails
// Manually run the task here https://console.cloud.google.com/cloudscheduler
exports.profileReminders = onSchedule("every day 23:00", async (event) => {
  const db = admin.firestore();

  const userProfilesSnapshot = await db.collection('users').where('status', '==', 'unverified').get();
  const userProfiles = userProfilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Use a pool so that we delete maximum `MAX_CONCURRENT` users in parallel.
  const { results, errors } = await PromisePool
    .withConcurrency(3)
    .for(userProfiles)
    .process(async (userProfile: any, index, pool) => {
      logger.log('userProfile', userProfile);
      const daysSince = getDaysDifference(userProfile?.createdAt ?? userProfile?.lastLogin);

      const userRef = await db.doc(`users/${userProfile.id}`);

      const userName = userProfile?.firstName ?? userProfile?.displayName;
      const userEmail = userProfile?.email;

      let updateData: any = {};
      let emailData: any = {
        to: [{
          email: userEmail,
          name: userName
        }],
        personalization: [
          {
            email: userEmail,
            data: {
              name: userName
            }
          }
        ]
      };

      if (daysSince >= 31 && userProfile.status !== 'deactivated') {
        // updateData = { status: 'deactivated' };
        // /* TODO: Send Deactivated email */

      } else if (daysSince >= 24 && !userProfile?.profileEmails?.['24d']) {
        updateData = { profileEmails: { '24d': true } };

        emailData = {
          ...emailData,
          template_id: 'pq3enl6nq2842vwr',
          subject: `Your Account Is About to Be Deactivated 🙁`
        };

      } else if (daysSince >= 10 && !userProfile?.profileEmails?.['10d']) {
        updateData = { profileEmails: { '10d': true } };

        emailData = {
          ...emailData,
          template_id: '351ndgwwo1rgzqx8',
          subject: `Don't Miss Out on Everything We Have to Offer! 🎉`
        };

      } else if (daysSince >= 3 && !userProfile?.profileEmails?.['3d']) {
        updateData = { profileEmails: { '3d': true } };

        emailData = {
          ...emailData,
          template_id: 'neqvygmo5jzl0p7w',
          subject: `Don't Miss Out on New Opportunities!!`
        };

      } else if (daysSince >= 1 && !userProfile.profileEmails?.['1d']) {
        updateData = { profileEmails: { '1d': true } };

        emailData = {
          ...emailData,
          template_id: '0p7kx4x6om749yjr',
          subject: `Let's Get Your Profile Approved!`
        };
      }

      if (emailData?.template_id?.length) {
        const emailRef = await db.collection('emails').add(emailData);
        logger.info('profile reminder email added, doc ref:', emailRef);
      }

      if (Object.keys(updateData).length > 0) {
        const updatedDoc = await userRef.update(updateData);
        logger.info('user document updated:', updatedDoc);
      }

      return;
    });

    if (errors.length > 0) {
      logger.error('you\'ve got errors:', errors);
    }

    if (results.length > 0) {
      logger.info('you\'ve got results:', results);
    }


    return;
});

function getDaysDifference(epoch: number): number {
  const currentDate = new Date();
  const givenDate = new Date(epoch);

  const diffInTime = currentDate.getTime() - givenDate.getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);

  return Math.abs(Math.round(diffInDays));
}
