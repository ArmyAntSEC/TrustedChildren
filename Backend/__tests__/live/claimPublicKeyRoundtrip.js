const { config } = require("aws-sdk");

const axios = require("axios").default
const baseURL = "https://seqfwj19u3.execute-api.eu-west-1.amazonaws.com/Prod/devices/";

describe('Test public key and Uuid roundtrip', () => {

    it('should claim a public key and a uuid', async () => {
        const publicKey = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();
        const uuid = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();        

        const request1 = {
            url: baseURL,
            method: "post",
            headers: { "x-api-key": process.env.API_KEY },
            data: {
                "publicKey": publicKey,
                "uuid": uuid
            }
        }

        const response1 = await axios(request1)
        expect(response1.status).toEqual(204);
        
    });
    
    it('should not put with wrong API key', async () => {
        const request1 = {
            url: baseURL,
            method: "post",
            headers: { "x-api-key": "Bad key" },
            data: {
                "recipientID": "Does",
                "senderID": "Not",
                "data": "matter"
            },
            validateStatus: () => true
        }
        const response1 = await axios(request1)
        expect(response1.status).toEqual(403);

    })
    
});
