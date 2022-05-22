// Import all functions from put-item.js 
const lambda = require('../../../src/handlers/putSingleItem.js');
// Import dynamodb from aws-sdk 
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
            body: '{"recipientID": "id1","senderID": "id2", "data": "data"}'
        };

        const result = await lambda.putSingleItemHandler(event);
        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify(returnedItem)
        };

        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult);
    });
});
