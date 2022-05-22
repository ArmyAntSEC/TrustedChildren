const apiUtilities = require('../utils/apiUtilities.js');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.SAMPLE_TABLE;

function doHandleGetByRecipientID(event) {

}

exports.getByRecipientIdHandler = async (event) => {
  return await wrapper(event, doGetByRecipientID);
};

async function wrapper(event, handler) {

  console.info('received:', event);
  apiUtilities.verifyStandardKey(event);
  try {
    const data = await handler(event);
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (exception) {
    if (exception instanceof apiUtilities.ErrorResponse) {
      return {
        statusCode: exception.statusCode,
        body: exception.body
      };
    } else {
      return {
        statusCode: 500,
        body: "Internal Server Error"
      };
    }
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
