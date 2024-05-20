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
        subject: `Your Profile Was Approved on CertifyndABA!`,
        template_id: 'pxkjn41jn504z781',
        personalization: [
          {
            email,
            data: {
              name
            }
          }
        ]
    });
  }
});

