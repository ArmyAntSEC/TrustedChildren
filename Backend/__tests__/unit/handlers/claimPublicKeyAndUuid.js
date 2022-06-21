const lambda = require('../../../src/handlers/claimPublicKeyAndUuid.js');
const dynamodb = require('aws-sdk/clients/dynamodb');

const myConfig = require("../../config/config.json")
process.env.HASHED_API_KEY = myConfig.HASHED_API_KEY;

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

        const result = await lambda.claimPublicKeyAndUuidHandler(event);
        const expectedResult = {
            statusCode: 204,
            body: ""
        };
        expect(result).toEqual(expectedResult);
    }

    beforeEach(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');

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

        const firstCommand = {
            'TableName': undefined,
            'Item': {
                'PK': "PUBKEY#" + sentItem.publicKey,
                'SK': "PUBKEY#" + sentItem.publicKey,
                'uuid': sentItem.uuid
            }
        }        
    
        const secondCommand = {
            'TableName': undefined,
            'Item': {
                'PK': "UUID#" + sentItem.uuid,
                'SK': "UUID#" + sentItem.uuid,
                'uuid': sentItem.publicKey
            }
        }        

        expect(putSpy).toHaveBeenCalledTimes(2);
        expect(putSpy).toHaveBeenNthCalledWith(1, firstCommand);
        expect(putSpy).toHaveBeenNthCalledWith(2, secondCommand);
    });
});


