/* OLD CODE */


// /* Amplify Params - DO NOT EDIT
// 	API_TYGESCONNEX_GRAPHQLAPIENDPOINTOUTPUT
// 	API_TYGESCONNEX_GRAPHQLAPIIDOUTPUT
// 	API_TYGESCONNEX_GRAPHQLAPIKEYOUTPUT
// 	ENV
// 	REGION
// Amplify Params - DO NOT EDIT */

// /**
//  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
//  */

// const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
// const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

// const ddbClient = new DynamoDBClient({ region: process.env.REGION });
// const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// const getCompany = async (companyID) => {
//   let params = {
//     Key: {
//       id: companyID
//     },
//     TableName: `Company-${process.env.API_TYGESCONNEX_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`
//   };

//   return ddbDocClient.send(new GetCommand(params));
// };

// const updateCompany = async (companyID, availableRequests) => {
//   const command = new UpdateCommand({
//     TableName: `Company-${process.env.API_TYGESCONNEX_GRAPHQLAPIIDOUTPUT}-${process.env.ENV}`,
//     Key: {
//       id: companyID,
//     },
//     UpdateExpression: `SET availableRequests = :availableRequests`,
//     ExpressionAttributeValues: {
//       ":availableRequests": availableRequests
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

//     const companyID = record.dynamodb?.NewImage?.companyID?.S;

//     const company = (await getCompany(companyID))?.Item;

//     if (record.eventName === 'INSERT') {
//       const availableRequests = company.availableRequests - 1;

//       console.log(
//         `New Request Sent By ${company.name}. New Available Requests: ${availableRequests}`
//       );

//       try {
//         await updateCompany(company.id, availableRequests);
//       } catch(err) {
//         console.log(`Error updating company requests: ${err}`);
//       }

//     }
//   }
//   return Promise.resolve('Successfully processed DynamoDB record');
// };
