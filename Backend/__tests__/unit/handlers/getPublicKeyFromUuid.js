const lambda = require('../../../src/handlers/getPublicKeyFromUuid.js');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test getPublicKeyFromUuid', () => {
  let getSpy;

  beforeAll(() => {
    getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
  });

  afterAll(() => {
    getSpy.mockRestore();
  });

  it('should get publicKey for a given uuid', async () => {
    const databaseItem = {
      Items: [
        {
          SK: 'UUID#uuid123',
          publicKey: 'publicKey123',
          PK: 'UUID#uuid123'
        }
      ],
      Count: 1,
      ScannedCount: 1
    };

    getSpy.mockReturnValue({
      promise: () => Promise.resolve(databaseItem)
    });

    const event = {
      httpMethod: 'GET',
      pathParameters: {
        uuid: 'uuid123'
      },
      headers: {
        'x-api-key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD"
      }
    }

    const result = await lambda.getPublicKeyFromUuidHandler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify({ publicKey: "publicKey123" })
    };

    expect(result).toEqual(expectedResult);
  });
});
