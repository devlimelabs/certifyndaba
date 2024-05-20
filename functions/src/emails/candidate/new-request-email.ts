import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
export const newRequestEmail = onDocumentCreated(`companies/{companyID}/requests/{requestID}`, async event => {

  logger.log('event', event);

  const data = event?.data?.data();

  logger.log('event.data.data()', data);

  const userRef: any = await db.collection('users').doc(data?.candidateID).get();
  const user = { id: userRef.id, ...userRef.data() };

  const companyRef: any = await db.collection('companies').doc(data?.companyID).get();
  const company = { id: companyRef.id, ...companyRef.data() };

  await db.collection('emails').add({
      to: [
        {
          email: user.email,
          name: user.displayName
        }
      ],
      subject: `You have a new request on CertifyndABA!`,
      template_id: '3zxk54vrw3pgjy6v',
      personalization: [
        {
          email: user.email,
          data: {
            name: user?.firstName ?? user?.displayName,
            company,
            request: data
          }
        }
      ]
  });

  logger.info(`New Request Email sent to ${user.email}, from ${company.name}`);
});
