const { config } = require("aws-sdk");

const axios = require("axios").default
const baseURL = "https://seqfwj19u3.execute-api.eu-west-1.amazonaws.com/Prod/devices/";

function makePostRequest(publicKey, uuid) {

  return {
    url: baseURL,
    method: "post",
    headers: { "x-api-key": process.env.API_KEY },
    data: {
      "publicKey": publicKey,
      "uuid": uuid
    },
    validateStatus: () => true
  }
}

function makeGetRequest(uuid) {

  return {
    url: baseURL + uuid,
    method: "get",
    headers: { "x-api-key": process.env.API_KEY },
    validateStatus: () => true
  }
}

describe('Test public key and Uuid roundtrip', () => {

  it('should claim a public key and a uuid and then return it', async () => {

    const publicKey = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();
    const uuid = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();

    const request1 = makePostRequest(publicKey, uuid);
    const response1 = await axios(request1)
    expect(response1.status).toEqual(204);

    const request2 = makeGetRequest(uuid);
    const response2 = await axios(request2)
    expect(response2.status).toEqual(200);
    expect(response2.data.publicKey).toEqual(publicKey);
  });

  it('should not claim a duplicate public key', async () => {

    const publicKey = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();
    const uuid1 = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();
    const uuid2 = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();

    const request1 = makePostRequest(publicKey, uuid1);
    const response1 = await axios(request1)
    expect(response1.status).toEqual(204);

    const request2 = makePostRequest(publicKey, uuid2);
    const response2 = await axios(request2)
    expect(response2.status).toEqual(500);

  });

  it('should not claim a duplicate uuid key', async () => {

    const publicKey1 = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();
    const publicKey2 = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();
    const uuid = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();

    const request1 = makePostRequest(publicKey1, uuid);
    const response1 = await axios(request1)
    expect(response1.status).toEqual(204);

    const request2 = makePostRequest(publicKey2, uuid);
    const response2 = await axios(request2)
    expect(response2.status).toEqual(500);

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
