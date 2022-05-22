const apiUtilities = require('../utils/apiUtilities.js');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.SAMPLE_TABLE;

function doHandleGetByRecipientID(event) {

}

exports.getByRecipientIdHandler = async (event) => {

  try {

    return await wrapper(event, doGetByRecipientID);
  } catch (exception) {
    if (exception instanceof apiUtilities.ErrorResponse) {
      return {
        statusCode: exception.statusCode,
        body: exception.body
      };
    } else {
      return {
        statusCode: 500,
        body: "Unexpected error"
      };
    }
  }
};

async function wrapper(event, handler) {

  console.info('received:', event);
  apiUtilities.verifyStandardKey(event);
  try {
    const data = await handler(event);
    const response = {
      statusCode: 200,
      body: JSON.stringify(data)
    };
    return response;
  } catch (exception) {

  }
}

async function doGetByRecipientID(event) {
  apiUtilities.verifyProperMethod(event, "GET");

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
