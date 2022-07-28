const lambda = require('../../../src/handlers/getByRecipientId.js');
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
        const item = [
            { recipientID: 'id1', senderID: 'id2', data: 'data' },
            { recipientID: 'id1', senderID: 'id3', data: 'data2' }
        ];

        getSpy.mockReturnValue({
            promise: () => Promise.resolve(item)
        });

        const event = {
            httpMethod: 'GET',
            pathParameters: {
                recipientID: 'id1'
            },
            headers: {
                'x-api-key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD"
            }
        }

        // Invoke getByIdHandler() 
        const result = await lambda.getByRecipientIdHandler(event);

        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify(item)
        };

        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult);
    });
});
