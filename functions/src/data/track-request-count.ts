import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();
export const trackRequestCount = onDocumentCreated(`companies/{companyId}/requests/{requestId}`, async event => {
  const snapshot = event.data;

  if (!snapshot) return;

  const request = snapshot?.data();
  const companyId = event?.params?.companyId

  logger.info(`Removing 1 request from ${companyId}, for ${request?.title} to candidate ${request?.candidateID}`);

  const companyRef = db.doc(`companies/${companyId}`);

  await companyRef.update({
    availableRequests: FieldValue.increment(-1)
  });

  return;
});
