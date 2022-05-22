const verifyApiKey = require('../utils/apiUtilities.js');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.SAMPLE_TABLE;

function doHandleGetByRecipientID(event) {

}

exports.getByRecipientIdHandler = async (event) => {
  let response;

  try {
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
    response = {
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
