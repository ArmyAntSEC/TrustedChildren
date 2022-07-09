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

        const params1 = [{
            'Put': {
                'TableName': undefined,
                'Item': {
                    'PK': { 'S': 'PUBKEY#' + sentItem.publicKey },
                    'SK': { 'S': 'PUBKEY#' + sentItem.publicKey },
                    'uuid': { 'S': sentItem.uuid }
                },
                'ConditionExpression': 'attribute_not_exists(PK)'
            }
        },
        {
            'Put': {
                'TableName': undefined,
                'Item': {
                    'PK': { 'S': "UUID#" + sentItem.uuid },
                    'SK': { 'S': "UUID#" + sentItem.uuid },
                    'publicKey': { 'S': sentItem.publicKey }
                },
                'ConditionExpression': 'attribute_not_exists(PK)'
            }
        }];

        params2 = {
            TableName: undefined,
            Item: {
                PK: "PUBKEY#" + sentItem.publicKey,
                SK: "PUBKEY#" + sentItem.publicKey,
                uuid: sentItem.uuid
            },
            ConditionExpression: "attribute_not_exists(PK)"
        };

        expect(putSpy).toHaveBeenCalledTimes(1);
        expect(putSpy).toHaveBeenNthCalledWith(1, params2);
    });
});


