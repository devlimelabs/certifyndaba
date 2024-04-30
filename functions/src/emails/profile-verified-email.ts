import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const profileVerifiedEmail = onDocumentUpdated(`users/{userID}`, async event => {
  logger.log('event', event);

  const before = event?.data?.before.data();
  const after = event?.data?.after.data();

  logger.log('before.data()', before);
  logger.log('after.data()', after);

  const oldStatus = before?.status;
  const newStatus = after?.status;
  const email = after?.email;
  const name = `${after?.firstName} ${after?.lastName}`;

  if (oldStatus !== 'verified' && newStatus === 'verified') {
    db.collection('emails').add({
        to: [
          {
            email,
            name
          }
        ],
        subject: `Your profile was approved on CertifyndABA!`,
        html: `<h1>Your profile was approved on CertifyndABA</h1>
        <br/><p>You are now able to recieve offers from employers! To get the most and best offers for you, be sure your profile is fully completed. Go check over your profile now <a href="https://certifyndaba.com/app/candidate/profile">PROFILE</a></p>`,
        text: `
          Your profile was approved on CertifyndABA

          You are now able to recieve offers from employers!

          To get the most and best offers for you, be sure your profile is fully completed.
          Go review your profile now: https://certifyndaba.com/app/candidate/profile
        `
    });
  }

});

