const tableName = process.env.SAMPLE_TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.getByIdHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }
  console.info('received:', event);

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

  const response = {
    statusCode: 200,
    body: JSON.stringify(data)
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
