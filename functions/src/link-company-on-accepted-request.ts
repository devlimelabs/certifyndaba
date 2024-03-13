/* OLD LOGIC */
/* Amplify Params - DO NOT EDIT
	API_TYGESCONNEX_GRAPHQLAPIENDPOINTOUTPUT
	API_TYGESCONNEX_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

// const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
// const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

// /**
//  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
//  */
// const ddbClient = new DynamoDBClient({ region: process.env.REGION });
// const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// const getCandidate = async (candidateID) => {
//   let params = {
//     Key: {
//       id: candidateID
//     },
//     TableName: `Candidate-${process.env.API_TYGESCONNEX_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`
//   };

//   return ddbDocClient.send(new GetCommand(params));
// };

// const updateCandidate = async (candidateID, connectedCompanies) => {
//   const command = new UpdateCommand({
//     TableName: `Candidate-${process.env.API_TYGESCONNEX_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
//     Key: {
//       id: candidateID,
//     },
//     UpdateExpression: "SET connectedCompanies = :connectedCompanies",
//     ExpressionAttributeValues: {
//       ":connectedCompanies": connectedCompanies,
//     },
//     ReturnValues: "ALL_NEW",
//   });

//   return ddbDocClient.send(command);
// };

// exports.handler = async event => {
//   console.log(`EVENT: ${JSON.stringify(event)}`);
//   for (const record of event.Records) {
//     console.log(record.eventID);
//     console.log(record.eventName);
//     console.log('DynamoDB Record: %j', record.dynamodb);

//     if (record.eventName === 'MODIFY') {
//       const oldRecordNotAccepted = record.dynamodb?.OldImage?.status?.S !== 'Accepted';
//       const newRecordAccepted = record.dynamodb?.NewImage?.status?.S === 'Accepted'

//       if (oldRecordNotAccepted && newRecordAccepted) {
//         try {
//           const candidate = await getCandidate(record.dynamodb?.NewImage?.candidateID?.S);

//           const connectedCompanies = candidate?.Item?.connectedCompanies ?? [];
//           const requestCompanyGroupID = record.dynamodb?.NewImage?.companyGroupID.S;

//           if (connectedCompanies.includes(requestCompanyGroupID)) {
//             console.log('Candidate and Company are already connected!');
//           } else {
//             connectedCompanies.push(requestCompanyGroupID);
//             const updatedCandidate = await updateCandidate(record.dynamodb?.NewImage?.candidateID?.S, connectedCompanies);
//             console.log('Candidate updated successfully:', updatedCandidate);
//           }

//         } catch(err) {
//           console.log('error updating candidate:', err);
//         }
//       }
//     }

//   }
//   return Promise.resolve('Successfully processed DynamoDB record');
// };


