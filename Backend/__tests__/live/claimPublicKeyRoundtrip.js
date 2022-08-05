const { config } = require("aws-sdk");

const axios = require("axios").default
const baseURL = "https://seqfwj19u3.execute-api.eu-west-1.amazonaws.com/Prod/devices/";

describe('Test public key and Uuid roundtrip', () => {

  it('should claim a public key and a uuid and then return it', async () => {

    const publicKey = createUniqueString("publicKey");
    const uuid = createUniqueString("uuid");

    const response1 = await makePutRequestAndCall(publicKey, uuid);
    expect(response1.status).toEqual(204);

    const response2 = await makeGetRequestAndCall(uuid);
    expect(response2.status).toEqual(200);
    expect(response2.data.publicKey).toEqual(publicKey);
  });

  it('should not claim a duplicate public key', async () => {

    const publicKey = createUniqueString("publicKey");
    const uuid1 = createUniqueString("uuid");
    const uuid2 = createUniqueString("uuid");

    const response1 = await makePutRequestAndCall(publicKey, uuid1);
    expect(response1.status).toEqual(204);

    const response2 = await makePutRequestAndCall(publicKey, uuid2);
    expect(response2.status).toEqual(500);

    const response3 = await makeGetRequestAndCall(uuid1);
    expect(response3.data.publicKey).toEqual(publicKey);

    const response4 = await makeGetRequestAndCall(uuid2);
    expect(response4.status).toEqual(404);
  });

  it('should not claim a duplicate uuid key', async () => {

    const publicKey1 = createUniqueString("publicKey");
    const publicKey2 = createUniqueString("publicKey");
    const uuid = createUniqueString("uuid");

    const response1 = await makePutRequestAndCall(publicKey1, uuid);
    expect(response1.status).toEqual(204);

    const response2 = await makePutRequestAndCall(publicKey2, uuid);
    expect(response2.status).toEqual(500);

    const response3 = await makeGetRequestAndCall(uuid);
    expect(response3.data.publicKey).toEqual(publicKey1);

  });

  it('should not post with wrong API key', async () => {
    const request1 = {
      url: baseURL,
      method: "post",
      headers: { "X-Api-Key": "Bad key" },
      data: "Does not matter",
      validateStatus: () => true
    }
    const response1 = await axios(request1)
    expect(response1.status).toEqual(403);

  })

});


function createUniqueString(prefix) {
  return prefix + Math.floor(Math.random() * 1e8).toString();
}

async function makePutRequestAndCall(publicKey, uuid) {
  const request = makePutRequest(publicKey, uuid);
  return axios(request);
}

function makePutRequest(publicKey, uuid) {
  return {
    url: baseURL,
    method: "put",
    headers: { "X-Api-Key": process.env.API_KEY },
    data: {
      "publicKey": publicKey,
      "uuid": uuid
    },
    validateStatus: () => true
  }

}

async function makeGetRequestAndCall(uuid) {
  const request = makeGetRequest(uuid);
  return axios(request);
}

function makeGetRequest(uuid) {

  return {
    url: baseURL + uuid,
    method: "get",
    headers: { "X-Api-Key": process.env.API_KEY },
    validateStatus: () => true
  }
}
