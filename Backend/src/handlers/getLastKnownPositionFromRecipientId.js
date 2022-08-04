const apiUtilities = require('../utils/apiUtilities.js');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.LAST_KNOWN_POSITIONS_TABLE;

exports.handler = async (event) => {
  return apiUtilities.handlerWrapper(event, implementation);
};


async function implementation(event) {
  apiUtilities.verifyProperMethod(event, "GET");

  const recipientId = event.pathParameters.recipientId;
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'recipientId = :recipientId',
    ExpressionAttributeValues: {
      ':recipientId': recipientId
    }
  };

  return docClient.query(params).promise();
}
