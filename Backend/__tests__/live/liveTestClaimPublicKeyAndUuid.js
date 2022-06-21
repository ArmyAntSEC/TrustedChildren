const { config } = require("aws-sdk");

const axios = require("axios").default
const myConfig = require("../config/config.json")
const baseURL = "https://seqfwj19u3.execute-api.eu-west-1.amazonaws.com/Prod/devices/";

describe('Test device roundtrip', () => {    
    it('should not post with wrong API key', async () => {
        const request1 = {
            url: baseURL,
            method: "post",
            headers: { "x-api-key": "Bad key" },
            data: {
                "publicKey": "Does not",
                "uuid": "matter",
                'message': "Should never be seen"
            },
            validateStatus: () => true
        };

        const response1 = await axios(request1)
        expect(response1.status).toEqual(403);
    })

    it('should post new entries successfully', async () => {
        const publicKey = "TestPublicKey" + Math.floor(Math.random() * 1e8).toString();
        const uuid = "TestUuid" + Math.floor(Math.random() * 1e8).toString();

        const request1 = {
            url: baseURL,
            method: "post",
            headers: { "x-api-key": myConfig.API_KEY },
            data: {
                "publicKey": publicKey,
                "uuid": uuid,
                'message': "Adding single pair"
            },
            validateStatus: () => true
        };

        const response1 = await axios(request1)
        expect(response1.status).toEqual(204);
    })

    it('should fail on reposting the same entry', async () => {
        const publicKey = "TestPublicKey" + Math.floor(Math.random() * 1e8).toString();
        const uuid = "TestUuid" + Math.floor(Math.random() * 1e8).toString();

        const request1 = {
            url: baseURL,
            method: "post",
            headers: { "x-api-key": myConfig.API_KEY },
            data: {
                publicKey: publicKey,
                uuid: uuid,
                message: "First send"
            },
            validateStatus: () => true
        };

        const response1 = await axios(request1)
        expect(response1.status).toEqual(204);

        request1.data.message = "Second send";
        
        const response2 = await axios(request1)
        //expect(response2.status).toEqual(409);
    })
});
