const { config } = require("aws-sdk");

const axios = require("axios").default
const myConfig = require("./config.json")
const baseURL = "https://seqfwj19u3.execute-api.eu-west-1.amazonaws.com/Prod/";

describe('Test roundtrip', () => {

    it('should put two items and then retrieve them', async () => {
        const recipientID = "TestRecipientID" + Math.floor(Math.random() * 1e8).toString();
        const senderID = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();
        const data = "Test data " + Math.floor(Math.random() * 1e8).toString();
        const senderID2 = senderID + "ABD"; //Ensure that senderID is sorted before enderID2.
        const data2 = "Test data " + Math.floor(Math.random() * 1e8).toString();

        const request1 = {
            url: baseURL,
            method: "post",
            headers: { "x-api-key": myConfig.API_KEY },
            data: {
                "recipientID": recipientID,
                "senderID": senderID,
                "data": data
            }
        }
        const response1 = await axios(request1)
        expect(response1.status).toEqual(204);

        const request2 = {
            url: baseURL,
            method: "post",
            headers: { "x-api-key": myConfig.API_KEY },
            data: {
                "recipientID": recipientID,
                "senderID": senderID2,
                "data": data2
            }
        }
        const response2 = await axios(request2)
        expect(response2.status).toEqual(204);

        const request3 = {
            url: baseURL + recipientID,
            method: "get",
            headers: { "x-api-key": myConfig.API_KEY }
        }
        const response3 = await axios(request3)
        expect(response3.status).toEqual(200);
        expect(response3.data.Count).toEqual(2);
        expect(response3.data.Items[0].recipientID).toEqual(recipientID);
        expect(response3.data.Items[0].senderID).toEqual(senderID);
        expect(response3.data.Items[0].data).toEqual(data);
        expect(response3.data.Items[1].recipientID).toEqual(recipientID);
        expect(response3.data.Items[1].senderID).toEqual(senderID2);
        expect(response3.data.Items[1].data).toEqual(data2);

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

    it('should not put with wrong API key', async () => {
        const request = {
            url: baseURL + "doesNotMatter",
            method: "get",
            headers: { "x-api-key": "Bad key" },
            validateStatus: () => true
        }
        const response = await axios(request)
        expect(response.status).toEqual(403);
    })
});
