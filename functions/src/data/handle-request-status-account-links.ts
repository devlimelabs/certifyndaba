import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';

const db = getFirestore();

export const handleRequestStatusUpdateAccountLinks = onDocumentUpdated(`companies/{companyId}/requests/{requestId}`, async event => {
  const snapshot = event.data;

  if (!snapshot) return;
  const oldRequest = snapshot?.before?.data();
  const newRequest = snapshot?.after?.data();

  const oldStatus = oldRequest?.status;
  const newStatus = newRequest?.status;

  const candidateID = newRequest?.candidateID;
  const companyID = event?.params?.companyId;


  if (oldStatus !== 'Accepted' && newStatus === 'Accepted') {
    // Request was ACCEPTED
    const candidateRef = db.collection('users').doc(candidateID);
    const companyRef = db.collection('companies').doc(companyID);

    await candidateRef.update({
      connectedCompanies: FieldValue.arrayUnion(companyID),
      pendingCompanies: FieldValue.arrayRemove(companyID),
      rejectedCompanies: FieldValue.arrayRemove(companyID)
    });

    await companyRef.update({
      pendingCandidates: FieldValue.arrayRemove(candidateID),
      connectedCandidates: FieldValue.arrayUnion(candidateID),
      rejectedCandidates: FieldValue.arrayRemove(candidateID)
    });
  } else if (oldStatus !== 'Rejected' && newStatus === 'Rejected') {
    // Request was REJECTED
    const candidateRef = db.doc(`users/${candidateID}`);

    await candidateRef.update({
      connectedCompanies: FieldValue.arrayRemove(companyID),
      pendingCompanies: FieldValue.arrayRemove(companyID),
      rejectedCompanies: FieldValue.arrayUnion(companyID)
    });

    const companyRef = db.doc(`companies/${companyID}`);

    await companyRef.update({
      connectedCandidates: FieldValue.arrayRemove(candidateID),
      pendingCandidates: FieldValue.arrayRemove(candidateID),
      rejectedCandidates: FieldValue.arrayUnion(candidateID)
    });
  }
});


export const handleNewRequestAccountLinks = onDocumentCreated(`companies/{companyId}/requests/{requestId}`, async event => {

  logger.log('event', event);

  const data = event?.data?.data();

  logger.log('event.data.data()', data);

  const userRef: any = await db.collection('users').doc(data?.candidateID);
  // const userRefData = await userRef.get();
  // const user = { id: userRefData.id, ...userRefData.data() };

  const companyRef: any = await db.collection('companies').doc(data?.companyID);
  // const companyRefData = await companyRef.get();
  // const company = { id: companyRefData.id, ...companyRefData.data() };


  await userRef.update({
    pendingCompanies: FieldValue.arrayUnion(data?.companyID)
  });

  await companyRef.update({
    pendingCandidates: FieldValue.arrayUnion(data?.candidateID)
  });
});
