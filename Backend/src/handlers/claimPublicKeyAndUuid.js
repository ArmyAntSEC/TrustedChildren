const apiUtilities = require("../utils/apiUtilities.js");
const dynamodb = require("aws-sdk/clients/dynamodb");
var AWS = require("aws-sdk");

let options = {};

if (process.env.AWS_SAM_LOCAL) {
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
    console.debug("Claim core handler started");

    apiUtilities.verifyProperMethod(event, "POST");

    const body = JSON.parse(event.body);

    const publicKey = body.publicKey;
    const uuid = body.uuid;

    const params = [
        {
            "Put": {
                "TableName": tableName,
                "Item": {
                    "PK": { "S": "PUBKEY#" + publicKey },
                    "SK": { "S": "PUBKEY#" + publicKey },
                    "uuid": { "S": uuid }
                },
                "ConditionExpression": "attribute_not_exists(PK)"
            }
        },
        {
            "Put": {
                "TableName": tableName,
                "Item": {
                    "PK": { "S": "UUID#" + uuid },
                    "SK": { "S": "UUID#" + uuid },
                    "publicKey": { "S": publicKey }
                },
                "ConditionExpression": "attribute_not_exists(PK)"
            }
        }
    ];

    const params2 = {
        TableName: tableName,
        Item: {
            PK: "PUBKEY#" + publicKey,
            SK: "PUBKEY#" + publicKey,
            uuid: uuid
        },
        ConditionExpression: "attribute_not_exists(PK)"
    };

    try {
        console.debug("Doing a put...");
        console.debug( params2 );
        const response = await docClient.put(params2).promise();
        console.debug("Put succeeded");
    } catch (err) {
        console.error("Put failed");
        console.error( err );
        throw (err);
    }


}
