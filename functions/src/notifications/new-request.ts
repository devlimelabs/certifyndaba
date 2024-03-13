

// /* OLD CODE */

// const webpush = require('web-push');
// const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
// const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
// const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// /**
//  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
//  */

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

// const getCompany = async (companyID) => {
//   const ddbClient = new DynamoDBClient({ region: process.env.REGION });
//   const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

//   let params = {
//     Key: {
//       id: companyID
//     },
//     TableName: `Company-${process.env.API_TYGESCONNEX_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`
//   };

//   return ddbDocClient.send(new GetCommand(params));
// };

// const getUser = async (userID) => {
//   const ddbClient = new DynamoDBClient({ region: process.env.REGION });
//   const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

//   let params = {
//     Key: {
//       id: userID
//     },
//     TableName: `Candidate-${process.env.API_TYGESCONNEX_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`
//   };

//   return ddbDocClient.send(new GetCommand(params));
// };

// exports.handler = async event => {
//   console.log(`EVENT: ${JSON.stringify(event)}`);
//   console.log('ENV:', process.env.ENV)

//   for (const record of event.Records) {
//     console.log(record.eventID);
//     console.log(record.eventName);
//     console.log('DynamoDB Record: %j', record.dynamodb);

//     if (record.eventName === 'INSERT') {
//       const userID = record?.dynamodb?.NewImage?.candidateID?.S;
//       const title = record?.dynamodb?.NewImage?.title?.S;
//       const city = record?.dynamodb?.NewImage?.city?.S;
//       const state = record?.dynamodb?.NewImage?.state?.S;
//       const salary = record?.dynamodb?.NewImage?.salary?.S;
//       const userPushSettings = await getUserPushSettings(userID);

//       console.log('userPushSettings', userPushSettings);

//       if (userPushSettings.Item.requests && userPushSettings.Item.subscription) {
//         /* Send Notification Push */
//         try {
//           webpush.setVapidDetails(
//             process.env['PUSH_SUBJECT'],
//             process.env['PUSH_PUBLIC_KEY'],
//             process.env['PUSH_PRIVATE_KEY']
//           );

//           const notificationPayload = {
//             "notification": {
//                 "title": `CertifyndABA - New Connection Request`,
//                 "body": `${title} ${salary} - ${city}, ${state}`,
//                 "icon": "assets/logos/certifynd-icon.svg",
//                 "vibrate": [100, 50, 100],
//                 "data": {
//                     "dateOfArrival": Date.now(),
//                     "primaryKey": 1,
//                     "onActionClick": {
//                       "default": {
//                         "operation": "openWindow",
//                         "url": `https://certifyndaba.com/app/candidate/requests/${record?.dynamodb?.NewImage?.id?.S}`
//                       },
//                       "view": {
//                         "operation": "openWindow",
//                         "url": `https://certifyndaba.com/app/candidate/requests/${record?.dynamodb?.NewImage?.id?.S}`
//                       },
//                       "accept": {
//                         "operation": "sendRequest",
//                         "url": `https://certifyndaba.com/app/candidate/requests/${record?.dynamodb?.NewImage?.id?.S}`
//                       }
//                     }
//                 },
//                 "actions": [{
//                     "action": "view",
//                     "title": "View Connection Request"
//                 },
//                 {
//                   "action": "accept",
//                   "title": "Accept"
//                 }]
//             }
//           };

//           console.log('notification message', notificationPayload);

//           await webpush.sendNotification(userPushSettings.Item.subscription, JSON.stringify(notificationPayload));

//           console.log('Push Notification Sent!');
//         } catch (err) {
//           console.log('Push Notification Failed', err);
//         }

//       }

//       /* Send User Notification Email */

//       try {
//         const client = new SESClient({ region: process.env.REGION });
//         const user = await getUser(userID);

//         const emailInput = {
//           Source: process.env.SES_EMAIL,
//           Destination: {
//             ToAddresses: [user.Item.email],
//           },
//           Message: {
//             Subject: { Data: 'You have a new request on CertifyndABA!' },
//             Body: {
//               Text: {
//                 Data: `You have a new request from a company on CertifyndABA!\n\n${title} ${salary} - ${city}, ${state}\n\nTo view the details & respond to this request go to https://certifyndaba.com/app/candidate/requests/${record?.dynamodb?.NewImage?.id?.S}`,
//               },
//               Html: {
//                 Data: `<h1>You have a new request from a company on CertifyndABA!</h1><br/><p>${title} ${salary} - ${city}, ${state}\n\nTo view the details & respond to this request go to <a href="https://certifyndaba.com/app/candidate/requests/${record?.dynamodb?.NewImage?.id?.S}">Your Dashboard</a></p>`
//               }
//             },
//           },
//           ReplyToAddresses: [process.env.SES_EMAIL],
//         };

//         const command = new SendEmailCommand(emailInput);

//         await client.send(command);

//         console.log(`Success request notification email sent to ${user.Item.email}`);
//       } catch (err) {
//         console.log(err);
//         return Promise.reject(err);
//       }
//     }
//   }

//   return Promise.resolve('Successfully processed DynamoDB record');
// };
