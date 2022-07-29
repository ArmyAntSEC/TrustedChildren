const apiUtilities = require("../utils/apiUtilities.js");
const dynamodb = require("aws-sdk/clients/dynamodb");

let options = {};

if (process.env.AWS_SAM_LOCAL) {
  const AWS = require("aws-sdk")
  options.endpoint = new AWS.Endpoint("http://host.docker.internal:8000");
  console.debug("Using local AWS endpoint.");
}

const docClient = new dynamodb.DocumentClient(options);

const tableName = process.env.PUBLIC_KEY_UUID_MAPPING;

exports.claimPublicKeyAndUuidHandler = async (event) => {
  return apiUtilities.handlerWrapper(event, doClaimPublicKeyAndUuid);
}

async function doClaimPublicKeyAndUuid(event) {

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
    await docClient.transactWrite(params).promise();
  } catch (err) {
    console.error(err);
    throw (err);
  }


}
