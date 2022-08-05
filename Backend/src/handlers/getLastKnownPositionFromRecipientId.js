const apiUtilities = require('../utils/apiUtilities.js');

const tableName = process.env.LAST_KNOWN_POSITIONS_TABLE;

exports.handler = async (event) => {
  return apiUtilities.handlerWrapper(event, implementation);
};


async function implementation(event) {
  apiUtilities.verifyProperMethod(event, "GET");

  const recipientId = event.pathParameters.recipientId;
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'recipientId = :recipientId',
    ExpressionAttributeValues: {
      ':recipientId': recipientId
    }
  };

  const docClient = apiUtilities.createDocClient();
  const databaseResponse = await docClient.query(params).promise();

  return {
    "recipientId": recipientId,
    "lastKnownPositions": databaseResponse.Items.map(transformDatabaseItem)
  }

}

function transformDatabaseItem(item) {
  return {
    "senderId": item.senderId,
    "data": item.data
  }
}