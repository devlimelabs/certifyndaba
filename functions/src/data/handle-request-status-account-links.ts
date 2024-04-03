import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export const handleRequestStatusAccountLinks = onDocumentUpdated(`companies/{companyId}/requests/{requestId}`, async event => {
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

    await candidateRef.update({
      connectedCompanies: FieldValue.arrayUnion(companyID)
    });
  } else if (oldStatus !== 'Rejected' && newStatus === 'Rejected') {
    // Request was REJECTED
    const candidateRef = db.doc(`users/${candidateID}`);

    await candidateRef.update({
      rejectedCompanies: FieldValue.arrayUnion(companyID)
    });

    const companyRef = db.doc(`companies/${companyID}`);

    await companyRef.update({
      rejectedCandidates: FieldValue.arrayUnion(candidateID)
    });
  }
});
