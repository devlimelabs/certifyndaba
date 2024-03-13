/* OLD CODE - AWS AMPLIFY */
// const webpush = require('web-push');
// const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
// const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

// const getUserPushSettings = async (userID) => {
//   const ddbClient = new DynamoDBClient({ region: process.env.REGION });
//   const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

//   let params = {
//     Key: {
//       userID: userID
//     },
//     TableName: `UserPushSettings-${process.env.API_TYGESCONNEX_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`
//   };

//   return ddbDocClient.send(new GetCommand(params));
// };

// const sendNotification = async (userID, notificationPayload) => {
//   const userPushSettings = await getUserPushSettings(userID);

//   console.log('userPushSettings', userPushSettings);

//   if (userPushSettings.Item.subscription) {
//     webpush.setVapidDetails(
//       process.env['PUSH_SUBJECT'],
//       process.env['PUSH_PUBLIC_KEY'],
//       process.env['PUSH_PRIVATE_KEY']
//     );

//     console.log('notification message', notificationPayload);

//     const pushRes = await webpush.sendNotification(userPushSettings.Item.subscription, JSON.stringify(notificationPayload));
//     console.log('push res', pushRes);
//   }

//   return;
// }

// /**
//  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
//  */
// exports.handler = async event => {
//   console.log(`EVENT: ${JSON.stringify(event)}`);
//   for (const record of event.Records) {
//     console.log(record.eventID);
//     console.log(record.eventName);
//     console.log('DynamoDB Record: %j', record.dynamodb);

//     if (record.eventName === 'MODIFY') {
//       const oldStatus = record?.dynamodb?.OldImage?.status?.S
//       const newStatus = record?.dynamodb?.NewImage?.status?.S
//       const userID = record?.dynamodb?.NewImage?.id?.S;

//       if (oldStatus !== 'verified' && newStatus === 'verified') {
//         const verifiedNotificationPayload = {
//           "notification": {
//               "title": `CertifyndABA - Profile Verified`,
//               "body": `Your credentials have been verified, and you can now receive connection requests!`,
//               "icon": "assets/logos/concept-1-icon.svg",
//               "vibrate": [100, 50, 100],
//               "data": {
//                   "dateOfArrival": Date.now(),
//                   "primaryKey": 1,
//                   "onActionClick": {
//                     "default": {
//                       "operation": "openWindow",
//                       "url": `https://certifyndaba.com/app/candidate/profile`
//                     },
//                     "view": {
//                       "operation": "openWindow",
//                       "url": `https://certifyndaba.com/app/candidate/profile`
//                     }
//                   }
//               },
//               "actions": [{
//                 "action": "view",
//                 "title": "View Profile"
//               }]
//           }
//         };

//         await sendNotification(userID, verifiedNotificationPayload);

//       } else if (oldStatus !== 'rejected' && newStatus === 'rejected') {
//         const rejectedNotificationPayload = {
//           "notification": {
//               "title": `CertifyndABA - Profile Rejected`,
//               "body": `Your credentials could not be verified, head to your profile to correct the issue!`,
//               "icon": "assets/logos/concept-1-icon.svg",
//               "vibrate": [100, 50, 100],
//               "data": {
//                   "dateOfArrival": Date.now(),
//                   "primaryKey": 1,
//                   "onActionClick": {
//                     "default": {
//                       "operation": "openWindow",
//                       "url": `https://certifyndaba.com/app/candidate/profile`
//                     },
//                     "view": {
//                       "operation": "openWindow",
//                       "url": `https://certifyndaba.com/app/candidate/profile`
//                     }
//                   }
//               },
//               "actions": [{
//                 "action": "view",
//                 "title": "Review Profile"
//               }]
//           }
//         };

//         await sendNotification(userID, rejectedNotificationPayload);
//       }

//     }
//   }
//   return Promise.resolve('Successfully processed DynamoDB record');
// };
