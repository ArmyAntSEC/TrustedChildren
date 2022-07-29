const apiUtilities = require('../utils/apiUtilities.js');
const dynamodb = require('aws-sdk/clients/dynamodb');

let options = {};

if (process.env.AWS_SAM_LOCAL) {
  const AWS = require("aws-sdk")
  options.endpoint = new AWS.Endpoint("http://host.docker.internal:8000");
  console.debug("Using local AWS endpoint.");
}

const docClient = new dynamodb.DocumentClient(options);

const tableName = process.env.PUBLIC_KEY_UUID_MAPPING;

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
