const apiUtilities = require("../utils/apiUtilities.js");

exports.handler = async (event) => {
  return apiUtilities.handlerWrapper(event, implementation);
}

async function implementation(event) {

  apiUtilities.verifyProperMethod(event, "POST");

  const body = JSON.parse(event.body);

  const publicKey = body.publicKey;
  const uuid = body.uuid;
  const tableName = process.env.PUBLIC_KEY_UUID_MAPPING;

  const docClient = apiUtilities.createDocClient();
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

  await docClient.transactWrite(params).promise();
}
