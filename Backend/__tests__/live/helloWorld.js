const { config } = require("aws-sdk");

const axios = require("axios").default
const baseURL = process.env.BASE_URL + "hello";


describe('Test hello world', () => {

  it('should respond', async () => {
    const request = {
      url: baseURL,
      method: "get",
      headers: { "X-Api-Key": process.env.API_KEY },
      validateStatus: () => true
    }

    const response = await axios(request);
    expect(response.status).toEqual(200);
    expect(response.data).toEqual("Hello World!");
  });

});
