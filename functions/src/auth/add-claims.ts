import { getAuth } from 'firebase-admin/auth';
import { HttpsError, onRequest } from 'firebase-functions/v2/https';
const {logger} = require("firebase-functions/v2");


export const addClaims = onRequest({
  cors: true
}, async (req: any, res: any) => {

  logger.log('addClaims request', req);

  const request = req.body;
  logger.log('request body', request);
  // Get the ID token passed.
  const idToken = req.body.idToken;
  const accountType = req.body.accountType;

  try {
    // Verify the ID token and decode its payload.
    const claims = await getAuth().verifyIdToken(idToken);
    console.log('claims', claims);
    logger.log('claims', claims)

    const additionalClaims: any = { accountType };

    if (accountType === 'company') {
      /* TODO: expect companyId, name, role, etc */
      if (!req.body.companyID) {
        throw new HttpsError("failed-precondition", "Company ID is required for company users");
      }

      if (!req.body.companyName) {
        throw new HttpsError("failed-precondition", "Company Name is required for company users");
      }

      if (!req.body.companyRole) {
        throw new HttpsError("failed-precondition", "Company Role is required for company users");
      }

      additionalClaims.companyID = req.body.companyID;
      additionalClaims.companyName = req.body.companyName;
      additionalClaims.companyRole = req.body.companyRole;
    }

    const setClaims = await getAuth().setCustomUserClaims(claims.uid, additionalClaims);

    console.log('setClaims', setClaims)
    logger.log('setClaims', setClaims)
    // Tell client to refresh token on user.
    res.status(200).send({
      status: 'success'
    });
  } catch(err) {
      res.status(500).send({ error: err });
  }
});
