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

    it('should get publicKey fora given uuid', async () => {
        const item = { publicKey: "publicKey" };

        getSpy.mockReturnValue({
            promise: () => Promise.resolve(item)
        });

        const event = {
            httpMethod: 'GET',
            pathParameters: {
                uuid: 'uuid'
            },
            headers: {
                'x-api-key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD"
            }
        }
        
        const result = await lambda.getPublicKeyFromUuidHandler(event);

        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify(item)
        };
        
        expect(result).toEqual(expectedResult);
    });
});
