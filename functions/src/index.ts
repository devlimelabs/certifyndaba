
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import * as admin from 'firebase-admin';

admin.initializeApp();

export * from './auth';
export * from './crons';
export * from './data';
export * from './emails';
