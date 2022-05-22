const apiUtilities = require('../utils/apiUtilities.js');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.SAMPLE_TABLE;

exports.getByRecipientIdHandler = async (event) => {
  return await apiUtilities.handlerWrapper(event, doGetByRecipientID);
};


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
