const apiUtilities = require('../utils/apiUtilities.js');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();


const tableName = process.env.PUBLIC_KEY_AND_UUID_MAPPING_TABLE;

exports.claimPublicKeyAndUuidHandler = async (event) => {
    return apiUtilities.handlerWrapper(event, doClaimPublicKeyAndUuid);
}

async function doClaimPublicKeyAndUuid(event) {
    apiUtilities.verifyProperMethod(event, "POST");

    const body = JSON.parse(event.body);

    const publicKey = body.publicKey;
    const uuid = body.uuid;

    const firstCommand = {
        'TableName': tableName,
        'Item': {
            'PK': "PUBKEY#" + publicKey,
            'SK': "PUBKEY#" + publicKey,
            'uuid': uuid
        }
    }
    console.debug( JSON.stringify(firstCommand));

    const secondCommand = {
        'TableName': tableName,
        'Item': {
            'PK': "UUID#" + uuid,
            'SK': "UUID#" + uuid,
            'uuid': publicKey
        }
    }
    console.debug( JSON.stringify(secondCommand));

    

    await docClient.put(firstCommand).promise();    
    await docClient.put(secondCommand).promise();    


}
