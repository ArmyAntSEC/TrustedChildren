const { config } = require("aws-sdk");

const axios = require("axios").default
const myConfig = require("./config.json")

describe('Test putSingleItemHandle', () => {

    it('should put a single item without error', async () => {

        const request = {
            url: "https://seqfwj19u3.execute-api.eu-west-1.amazonaws.com/Prod/",
            method: "post",
            headers: { "x-api-key": myConfig.API_KEY },
            body: {
                "recipientID": "id6",
                "senderID": "id23",
                "data": "Some fresh data"
            }
        }
        const response = await axios(request)
        expect(response.status).toEqual(204);

    });
});
