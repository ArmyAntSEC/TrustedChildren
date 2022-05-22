const { config } = require("aws-sdk");

const axios = require("axios").default
const myConfig = require("./config.json")

describe('Test getByRecipientIdHandler', () => {

    it('should get item by id', async () => {

        const request = {
            url: "https://seqfwj19u3.execute-api.eu-west-1.amazonaws.com/Prod/id6",
            method: "get",
            headers: { "x-api-key": myConfig.API_KEY }
        }
        const response = await axios(request)
        expect(response.status).toEqual(200);
        expect(response.data.Count).toEqual(3);
    });
});
