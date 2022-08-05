const getLastKnownPositionFromRecipientId = require('../../../src/handlers/getLastKnownPositionFromRecipientId.js');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test getByRecipientIdHandler', () => {
  let getSpy;

  beforeAll(() => {
    getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
  });

  afterAll(() => {
    getSpy.mockRestore();
  });

  it('should get item by id', async () => {

    getSpy.mockReturnValue({
      promise: () => Promise.resolve(
        {
          Items: [
            { recipientId: 'id1', senderId: 'id2', data: 'data' },
            { recipientId: 'id1', senderId: 'id3', data: 'data2' }
          ],
          Count: 2,
          ScannedCount: 2
        })
    });

    const event = {
      httpMethod: 'GET',
      pathParameters: {
        recipientId: 'id1'
      },
      headers: {
        'X-Api-Key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD"
      }
    }

    // Invoke getByIdHandler() 
    const result = await getLastKnownPositionFromRecipientId.handler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify({
        "recipientId": "id1",
        lastKnownPositions: [
          {
            "senderId": "id2",
            "data": "data"
          },
          {
            "senderId": "id3",
            "data": "data2"
          }
        ]
      })
    };

    // Compare the result with the expected result 
    expect(result).toEqual(expectedResult);
  });

});
