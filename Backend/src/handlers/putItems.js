const apiUtilities = require('../utils/apiUtilities.js');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();


const tableName = process.env.LAST_KNOWN_POSITIONS_TABLE;

exports.putItemsHandler = async (event) => {
    return apiUtilities.handlerWrapper(event, doPutItems);
}

async function doPutItems(event) {
    apiUtilities.verifyProperMethod(event, "POST");

    const body = JSON.parse(event.body);

    const senderID = body.senderID;

    for (const message of body.messages) {
        const recipientID = message.recipientID;
        const data = message.data;

        const params = {
            TableName: tableName,
            Item: { recipientID: recipientID, senderID: senderID, data: data
            }
        };

        await docClient.put(params).promise();

    }
}
