process.env.HASHED_API_KEY = "ba2ef371838b7644589abb2e43876a11670891758a4cdd801225490d17e7f870";
const lambda = require('../../../src/handlers/putSingleItem.js');
const dynamodb = require('aws-sdk/clients/dynamodb');

// This includes all tests for putItemHandler() 
describe('Test putSingleItemHandler', function () {
    let putSpy;

    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });

    afterAll(() => {
        putSpy.mockRestore();
    });

    it('should add id to the table', async () => {
        const returnedItem = { recipientID: 'id1', senderID: 'id2', data: 'data' };

        putSpy.mockReturnValue({
            promise: () => Promise.resolve(returnedItem)
        });

        const event = {
            httpMethod: 'POST',
            body: '{"recipientID": "id1","senderID": "id2", "data": "data"}',
            headers: {
                'x-api-key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD"
            }
        };

        const result = await lambda.putSingleItemHandler(event);
        const expectedResult = {
            statusCode: 204,
            body: ""
        };

        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult);
    });
});
