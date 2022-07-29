const postPublicKeyAndUuid = require('../../../src/handlers/postPublicKeyAndUuid.js');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test claimPublicKeyAndUUID', function () {
  let putSpy;

  const doActualCallAndCheckReturn = async function (sentItem) {
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify(sentItem),
      headers: {
        'x-api-key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD"
      }
    };

    const result = await postPublicKeyAndUuid.handler(event);
    const expectedResult = {
      statusCode: 204,
      body: ""
    };
    expect(result).toEqual(expectedResult);
  }

  beforeEach(() => {
    putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'transactWrite');

    putSpy.mockReturnValue({
      promise: () => Promise.resolve(null)
    });
  });

  afterEach(() => {
    putSpy.mockRestore();
  });

  it('should add a single PublicKey and UUID pair to the table', async () => {
    const sentItem = {
      publicKey: "someRandomPublicKey",
      uuid: "someRandomeUUID",
    };

    await doActualCallAndCheckReturn(sentItem);

    const expectedParams = {
      "TransactItems": [
        {
          'Put': {
            'TableName': process.env.PUBLIC_KEY_UUID_MAPPING,
            'Item': {
              'PK': 'PUBKEY#' + sentItem.publicKey,
              'SK': 'PUBKEY#' + sentItem.publicKey,
              'uuid': sentItem.uuid
            },
            'ConditionExpression': 'attribute_not_exists(PK)'
          }
        },
        {
          'Put': {
            'TableName': process.env.PUBLIC_KEY_UUID_MAPPING,
            'Item': {
              'PK': "UUID#" + sentItem.uuid,
              'SK': "UUID#" + sentItem.uuid,
              'publicKey': sentItem.publicKey
            },
            'ConditionExpression': 'attribute_not_exists(PK)'
          }
        }
      ]
    };

    expect(putSpy).toHaveBeenCalledTimes(1);
    expect(putSpy).toHaveBeenNthCalledWith(1, expectedParams);
  });
});


