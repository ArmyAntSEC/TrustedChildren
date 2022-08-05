const apiUtilities = require('../utils/apiUtilities.js');

const { ErrorResponse } = require('../utils/ErrorResponse.js');

exports.handler = async (event) => {
  return apiUtilities.handlerWrapper(event, implementation);
};

async function implementation(event) {
  apiUtilities.verifyProperMethod(event, "GET");

  const tableName = process.env.PUBLIC_KEY_UUID_MAPPING;
  const uuid = event.pathParameters.uuid;

  const docClient = apiUtilities.createDocClient();
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :uuid',
    ExpressionAttributeValues: {
      ':uuid': "UUID#" + uuid
    }
  };


  const databaseResponse = await docClient.query(params).promise();

  console.log(JSON.stringify(databaseResponse));
  if (databaseResponse.Count == 0) {
    throw new ErrorResponse(404, "No such UUID found");
  } else {
    return { "publicKey": databaseResponse.Items[0].publicKey };
  }

}
