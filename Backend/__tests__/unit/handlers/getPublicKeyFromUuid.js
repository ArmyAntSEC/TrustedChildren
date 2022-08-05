const getPublicKeyFromUuid = require('../../../src/handlers/getPublicKeyFromUuid.js');
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
        'X-Api-Key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD"
      }
    }

    const result = await getPublicKeyFromUuid.handler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify({ publicKey: "publicKey123" })
    };

    expect(result).toEqual(expectedResult);
  });

  it('should get return a 404 for nonexistent uuid', async () => {
    const databaseItem = {
      Items: [
      ],
      Count: 0,
      ScannedCount: 0
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
        'X-Api-Key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD"
      }
    }

    const result = await getPublicKeyFromUuid.handler(event);

    const expectedResult = {
      statusCode: 404,
      body: "No such UUID found"
    };

    expect(result).toEqual(expectedResult);
  });
});
