const apiUtilities = require('../utils/apiUtilities.js');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();


const tableName = process.env.LAST_KNOWN_POSITIONS_TABLE;

exports.handler = async (event) => {
  return apiUtilities.handlerWrapper(event, implementation);
}

async function implementation(event) {
  apiUtilities.verifyProperMethod(event, "PUT");

  const body = JSON.parse(event.body);

  const senderId = body.senderId;

  for (const message of body.messages) {
    const recipientId = message.recipientId;
    const data = message.data;

    const params = {
      TableName: tableName,
      Item: {
        recipientId: recipientId, senderId: senderId, data: data
      }
    };

    console.log(params);
    await docClient.put(params).promise();

  }
}
