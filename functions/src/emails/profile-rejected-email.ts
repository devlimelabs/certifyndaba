import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const profileRejectedEmail = onDocumentUpdated(`users/{userID}`, async event => {
  logger.log('event', event);

  const before = event?.data?.before.data();
  const after = event?.data?.after.data();

  logger.log('before.data()', before);
  logger.log('after.data()', after);

  const oldStatus = before?.status;
  const newStatus = after?.status;
  const email = after?.email;
  const name = `${after?.firstName} ${after?.lastName}`;
  const reason = after?.rejectionReason;

  if (oldStatus !== 'rejected' && newStatus === 'rejected') {
    db.collection('emails').add({
        to: [
          {
            email,
            name
          }
        ],
        subject: `Your profile was rejected on CertifyndABA!`,
        html: `<h1>Your profile could not be verified on CertifyndABA. Here's Why:</h1>
        <br/><p>${reason}<br/>
        Once your profile is updated it will be automatically resubmitted for verification. Update your profile now <a href="https://certifyndaba.com/app/candidate/profile">PROFILE</a></p>`,
        text: `
          Your profile could not be verified on CertifyndABA. Here's Why:

          ${reason}

          Once your profile is updated it will automatically be resubmitted for verification.
          Update your profile now: https://certifyndaba.com/app/candidate/profile
        `
    });
  }

});

