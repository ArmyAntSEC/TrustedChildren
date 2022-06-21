const apiUtilities = require('../utils/apiUtilities.js');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();


const tableName = process.env.PUBLIC_KEY_UUID_MAPPING;

exports.claimPublicKeyAndUuidHandler = async (event) => {
    return apiUtilities.handlerWrapper(event, doClaimPublicKeyAndUuid);
}

async function doClaimPublicKeyAndUuid(event) {
    apiUtilities.verifyProperMethod(event, "POST");

    const body = JSON.parse(event.body);

    const publicKey = body.publicKey;
    const uuid = body.uuid;

    const params = [
        {
            'Put': {
                'TableName': tableName,
                'Item': {
                    'PK': { 'S': 'PUBKEY#' + publicKey },
                    'SK': { 'S': 'PUBKEY#' + publicKey },
                    'uuid': { 'S': uuid }
                },
                'ConditionExpression': 'attribute_not_exists(PK)'
            }
        },
        {
            'Put': {
                'TableName': tableName,
                'Item': {
                    'PK': { 'S': "UUID#" + uuid },
                    'SK': { 'S': "UUID#" + uuid },
                    'publicKey': {'S': publicKey }
                },
                'ConditionExpression': 'attribute_not_exists(PK)'
            }
        }
    ];

    await docClient.put(params).promise();


}
