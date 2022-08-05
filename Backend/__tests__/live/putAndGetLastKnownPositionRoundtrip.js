const { config } = require("aws-sdk");

const axios = require("axios").default
const baseURL = process.env.BASE_URL;

describe('Test roundtrip', () => {

  it('should put two items and then retrieve them', async () => {
    const senderId = createUniqueString("TestSenderID");
    const recipientId = createUniqueString("TestRecipientID");
    const data = createUniqueString("Test data");
    const recipientId2 = createUniqueString("TestRecipientID");
    const data2 = createUniqueString("Test data");
    const senderId2 = senderId + "ABD"; //Ensure that senderID is sorted before senderID2.
    const data3 = createUniqueString("Test data");

    const request1 = {
      url: baseURL,
      method: "put",
      headers: { "X-Api-Key": process.env.API_KEY },
      data: {
        "senderId": senderId,
        "messages": [{
          "recipientId": recipientId,
          "data": data
        }, {

          "recipientId": recipientId2,
          "data": data2
        }]
      },
      validateStatus: () => true
    }

    const response1 = await axios(request1)
    expect(response1.status).toEqual(204);

    const request2 = {
      url: baseURL,
      method: "put",
      headers: { "X-Api-Key": process.env.API_KEY },
      data: {
        "senderId": senderId2,
        "messages": [{
          "recipientId": recipientId,
          "data": data3
        }]
      },
      validateStatus: () => true
    }

    const response2 = await axios(request2)
    expect(response2.status).toEqual(204);

    const request3 = {
      url: baseURL + recipientId,
      method: "get",
      headers: { "X-Api-Key": process.env.API_KEY },
      validateStatus: () => true
    }

    const response3 = await axios(request3)
    expect(response3.status).toEqual(200);
    expect(response3.data.recipientId).toEqual(recipientId);
    expect(response3.data.lastKnownPositions[0].senderId).toEqual(senderId);
    expect(response3.data.lastKnownPositions[0].data).toEqual(data);
    expect(response3.data.lastKnownPositions[1].senderId).toEqual(senderId2);
    expect(response3.data.lastKnownPositions[1].data).toEqual(data3);
    expect(response3.data.lastKnownPositions.length).toEqual(2);

    const request4 = {
      url: baseURL + recipientId2,
      method: "get",
      headers: { "X-Api-Key": process.env.API_KEY },
      validateStatus: () => true
    }
    const response4 = await axios(request4)
    expect(response4.status).toEqual(200);
    expect(response4.data.recipientId).toEqual(recipientId2);
    expect(response4.data.lastKnownPositions[0].senderId).toEqual(senderId);
    expect(response4.data.lastKnownPositions[0].data).toEqual(data2);
    expect(response4.data.lastKnownPositions.length).toEqual(1);
  });
});

function createUniqueString(prefix) {
  return prefix + Math.floor(Math.random() * 1e8).toString();
}
