const verifyApiKey = require('../utils/verifyAPIKey.js');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.SAMPLE_TABLE;

function doHandleGetByRecipientID(event) {

}

exports.getByRecipientIdHandler = async (event) => {
  let response;

  try {
    if (event.httpMethod !== 'GET') {
      throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
    }
    console.info('received:', event);

    if (!verifyApiKey.verifyStandardKey(event.headers['x-api-key'])) {
      throw new Error("Invalid API Key provided");
    }

    data = await doGetByRecipientID(event);

    response = {
      statusCode: 200,
      body: JSON.stringify(data)
    };


  } catch (exception) {
    const response = {
      statusCode: 400,
      body: { errorMessage: exception }
    };
  } finally {
    // All log statements are written to CloudWatch
    console.info("Response:", response);
    return response;
  }
};

async function doGetByRecipientID(event) {

  const recipientID = event.pathParameters.recipientID;

  var params = {
    TableName: tableName,
    KeyConditionExpression: 'recipientID = :recipientID',
    ExpressionAttributeValues: {
      ':recipientID': recipientID
    }
  };

  console.info('params:', params);

  const data = await docClient.query(params).promise();
  console.info('data:', data);

  return data;
}
