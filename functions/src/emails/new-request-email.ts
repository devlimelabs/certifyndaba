import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
export const newRequestEmail = onDocumentCreated(`companies/{companyID}/requests/{requestID}`, async event => {

  logger.log('event', event);

  const data = event?.data?.data();

  logger.log('event.data.data()', data);

  const title = data?.title ?? '';
  const salary = data?.salary ?? '';
  const city = data?.city ?? '';
  const state = data?.state ?? '';

  const userRef: any = await db.collection('users').doc(data?.candidateID).get();

  const user = { id: userRef.id, ...userRef.data() };

  db.collection('emails').add({
      to: [
        {
          email: user.email,
          name: user.displayName
        }
      ],
      subject: `You have a new request on CertifyndABA!`,
      html: `<h1>You have a new request from a company on CertifyndABA!</h1><br/><p>${title} ${salary} - ${city}, ${state}\n\nTo view the details & respond to this request go to <a href="https://certifyndaba.com/app/candidate/requests/${event?.params?.requestID}">Your Dashboard</a></p>`,
      text: `You have a new request from a company on CertifyndABA!\n\n${title} ${salary} - ${city}, ${state}\n\nTo view the details & respond to this request go to https://certifyndaba.com/app/candidate/requests/${event?.params?.requestID}`
  });
});
