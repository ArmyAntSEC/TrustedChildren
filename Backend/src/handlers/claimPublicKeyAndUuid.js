const apiUtilities = require("../utils/apiUtilities.js");
const dynamodb = require("aws-sdk/clients/dynamodb");


let options = {};

if (process.env.AWS_SAM_LOCAL) {
    const AWS = require("aws-sdk")
    options.endpoint = new AWS.Endpoint("http://host.docker.internal:8000");
    console.debug("Using local AWS endpoint.");
} else {
    console.debug("Using remote AWS endpoint.");
}

const docClient = new dynamodb.DocumentClient(options);
console.debug("DocClient created.");

const tableName = process.env.PUBLIC_KEY_UUID_MAPPING;

exports.claimPublicKeyAndUuidHandler = async (event) => {
    return apiUtilities.handlerWrapper(event, doClaimPublicKeyAndUuid);
}

async function doClaimPublicKeyAndUuid(event) {
    console.debug("Claim core handler started. TableName: " + tableName );


    apiUtilities.verifyProperMethod(event, "POST");

    const body = JSON.parse(event.body);

    const publicKey = body.publicKey;
    const uuid = body.uuid;

    const params = {
        "TransactItems": [
            {
                "Put": {
                    "TableName": tableName,
                    "Item": {
                        "PK": "PUBKEY#" + publicKey,
                        "SK": "PUBKEY#" + publicKey,
                        "uuid": uuid
                    },
                    "ConditionExpression": "attribute_not_exists(PK)"
                }
            },
            {
                "Put": {
                    "TableName": tableName,
                    "Item": {
                        "PK": "UUID#" + uuid,
                        "SK": "UUID#" + uuid,
                        "publicKey": publicKey
                    },
                    "ConditionExpression": "attribute_not_exists(PK)"
                }
            }
        ]
    };

    try {
        console.debug("Doing a put...");
        console.debug( JSON.stringify(params) );
        const response = await docClient.transactWrite(params).promise();
        console.debug("Put succeeded: " + JSON.stringify(response));
    } catch (err) {
        console.error("Put failed");
        console.error( err );
        throw (err);
    }


}
