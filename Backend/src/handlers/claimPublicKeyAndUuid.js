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
    const message = body.message;
    

    const firstCommand = {
        'TableName': tableName,
        'ConditionExpression': 'attribute_not_exists(PK)',
        'Item': {
            'PK': "PUBKEY#" + publicKey,
            'SK': "PUBKEY#" + publicKey,
            'uuid': uuid,
            'message': message            
        }
    }
    const firstTransaction = {
        "TransactItems": [
            {
                "Put": firstCommand
            }
        ]
    }

    console.debug( JSON.stringify(firstTransaction));
    const result = await docClient.transactWrite(firstTransaction);    
    result.promise().then( function(data){
        //Do nothing.
    }, function(error){
        console.error( error );
    });

}
