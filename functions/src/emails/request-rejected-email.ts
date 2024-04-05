import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
export const requestRejectedEmail = onDocumentUpdated(`companies/{companyID}/requests/{requestID}`, async event => {

  logger.log('event', event);

  const before = event?.data?.before.data();
  const after = event?.data?.after.data();

  logger.log('before.data()', before);
  logger.log('after.data()', after);

  const oldStatus = before?.status;
  const newStatus = after?.status;
  const companyID = after?.companyID;

  if (oldStatus !== 'rejected' && newStatus === 'rejected') {
    const companyRef: any = await db.collection(`companies`).doc(companyID).get();

    const company = { id: companyRef.id, ...companyRef.data() };

    db.collection('mail').add({
        to: [
          {
            email: company.email,
            name: company.name
          }
        ],
        subject: `Your Connection Request was Declined on CertifyndABA!`,
        html: `<h1>Your Connection Request was Declined on CertifyndABA!</h1>
        <br/><p>${after?.title} ${after?.salary} - ${after?.city}, ${after?.state}<br/>
        To view the contact details of the request candidate go to your <a href="https://certifyndaba.com/app/company/requests/${event?.params?.requestID}">Request Dashboard</a></p>`,
        text: `
          You're Connection Request has been Declined for:

          ${after?.title}
          ${after?.salary} - ${after?.city}, ${after?.state}

          To view this request, go to the Request Details Page:
          https://certifyndaba.com/app/company/requests/${event?.params?.requestID}
        `
    });
  }

});

