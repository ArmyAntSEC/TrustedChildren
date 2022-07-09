const apiUtilities = require('../utils/apiUtilities.js');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.LAST_KNOWN_POSITIONS_TABLE;

exports.getPublicKeyFromUuidHandler = async (event) => {
  return apiUtilities.handlerWrapper(event, doGetPublicKeyFromUuid);
};


async function doGetPublicKeyFromUuid(event) {
  apiUtilities.verifyProperMethod(event, "GET");

  const uuid = event.pathParameters.uuid;
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :uuid',
    ExpressionAttributeValues: {
      ':uuid': "UUID#" + uuid
    }
  };

  return docClient.query(params).promise();
}
