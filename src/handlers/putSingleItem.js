const apiUtilities = require('../utils/apiUtilities.js');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();


const tableName = process.env.SAMPLE_TABLE;

exports.putSingleItemHandler = async (event) => {
    return await apiUtilities.handlerWrapper(event, doPutSingleItem);
}
async function doPutSingleItem(event) {
    apiUtilities.verifyProperMethod(event, "POST");

    const body = JSON.parse(event.body);
    const recipientID = body.recipientID;
    const senderID = body.senderID;
    const data = body.data;

    var params = {
        TableName: tableName,
        Item: { recipientID: recipientID, senderID: senderID, data: data }
    };

    await docClient.put(params).promise();
};
