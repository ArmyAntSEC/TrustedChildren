const lambda = require('../../../src/handlers/getPublicKeyOnFile.js');
const dynamodb = require('aws-sdk/clients/dynamodb');
const myConfig = require("../../config/config.json")
process.env.HASHED_API_KEY = myConfig.HASHED_API_KEY;

describe('Test getPublicKeyOnFile', () => {
    let getSpy;

    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
    });

    afterAll(() => {
        getSpy.mockRestore();
    });

    it('should get public key from uuid', async () => {
        const item = [
            { PK: '1234', SK: '1234', 'publicKey': '4567', 'message': 'Test'  }            
        ];

        getSpy.mockReturnValue({
            promise: () => Promise.resolve(item)
        });

        const event = {
            httpMethod: 'GET',
            pathParameters: {
                uuid: '1234'
            },
            headers: {
                'x-api-key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD"
            }
        }

        // Invoke getByIdHandler() 
        const result = await lambda.getPublicKeyOnFileHandler(event);

        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify(item)
        };

        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult);
    });
});
