import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();
export const sendWelcomeEmail = onDocumentCreated(`users/*`, event => {
  console.log(event);
  db.collection('mail').add({
    to: 'john@devlimelabs.com',
    message: {
      subject: 'Hello from Firebase!',
      html: 'This is an <code>HTML</code> email body.'
    }
  });
});
