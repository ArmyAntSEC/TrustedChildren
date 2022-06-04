const apiUtilities = require('../utils/apiUtilities.js');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();


const tableName = process.env.SAMPLE_TABLE;

exports.putItemsHandler = async (event) => {
    return await apiUtilities.handlerWrapper(event, doPutItems);
}
async function doPutItems(event) {
    apiUtilities.verifyProperMethod(event, "POST");

    const body = JSON.parse(event.body);

    const senderID = body.senderID;

    for (message of body.messages) {
        const recipientID = message.recipientID;
        const data = message.data;

        var params = {
            TableName: tableName,
            Item: { recipientID: recipientID, senderID: senderID, data: data }
        };

        await docClient.put(params).promise();

    }
};