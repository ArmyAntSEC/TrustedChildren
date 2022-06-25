const apiUtilities = require('../utils/apiUtilities.js');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.getPublicKeyOnFileHandler = async (event) => {
  return apiUtilities.handlerWrapper(event, doGetPublicKeyOnFile);
};


async function doGetPublicKeyOnFile(event) {
  apiUtilities.verifyProperMethod(event, "GET");

  const uuid = event.pathParameters.uuid;
  const params = {
    TableName: process.env.PUBLIC_KEY_AND_UUID_MAPPING_TABLE,
    KeyConditionExpression: 'PK = :uuid',
    ExpressionAttributeValues: {
      ':uuid': uuid
    }
  };

  return docClient.query(params).promise();
}
