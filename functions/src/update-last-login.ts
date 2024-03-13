/**
 * OLD CODE
 */
// exports.handler = async (event, context) => {
//   let date = new Date().toISOString();

//   if (event?.request?.userAttributes?.sub && event?.request?.userAttributes?.['custom:accountType'] === 'candidate') {
//     console.log('event.request', event?.request);
//     let params = {
//       Item: {
//         'id': {S: event?.request?.userAttributes?.sub},
//         '_typename': {S: 'Candidate'},
//         'lastLogin': {S: date},
//         'updatedAt': {S: date }
//       },
//       TableName: process.env.CANDIDATE_TABLE
//     };

//     try {
//       await ddb.putItem(params).promise();
//       console.log('Success: Candidate Created!');
//     } catch (error) {
//       console.log('Error:', error);
//     }
//   } else {
//     console.log('Error: Nothing was written to DynamoDB');
//   }

//   return event;
// };

