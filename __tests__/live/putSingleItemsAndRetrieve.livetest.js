const { config } = require("aws-sdk");

const axios = require("axios").default
const myConfig = require("./config.json")

describe('Test put two items and retrieve', () => {

    it('should put two items and then retrieve them', async () => {
        const recipientID = "TestRecipientID" + Math.floor(Math.random() * 1e8).toString();
        const senderID = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();
        const data = "Test data " + Math.floor(Math.random() * 1e8).toString();
        const senderID2 = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();
        const data2 = "Test data " + Math.floor(Math.random() * 1e8).toString();

        const request1 = {
            url: "https://seqfwj19u3.execute-api.eu-west-1.amazonaws.com/Prod/",
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
            url: "https://seqfwj19u3.execute-api.eu-west-1.amazonaws.com/Prod/",
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
            url: "https://seqfwj19u3.execute-api.eu-west-1.amazonaws.com/Prod/" + recipientID,
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
});
