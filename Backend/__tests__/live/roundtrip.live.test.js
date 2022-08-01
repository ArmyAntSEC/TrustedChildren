const { config } = require("aws-sdk");

const axios = require("axios").default
const baseURL = "https://seqfwj19u3.execute-api.eu-west-1.amazonaws.com/Prod/";

describe('Test roundtrip', () => {

  it('should put two items and then retrieve them', async () => {
    const senderID = "TestSenderID" + Math.floor(Math.random() * 1e8).toString();
    const recipientID = "TestRecipientID" + Math.floor(Math.random() * 1e8).toString();
    const data = "Test data " + Math.floor(Math.random() * 1e8).toString();
    const recipientID2 = "TestRecipientID" + Math.floor(Math.random() * 1e8).toString();
    const data2 = "Test data " + Math.floor(Math.random() * 1e8).toString();
    const senderID2 = senderID + "ABD"; //Ensure that senderID is sorted before senderID2.
    const data3 = "Test data " + Math.floor(Math.random() * 1e8).toString();

    const request1 = {
      url: baseURL,
      method: "put",
      headers: { "x-api-key": process.env.API_KEY },
      data: {
        "senderID": senderID,
        "messages": [{
          "recipientID": recipientID,
          "data": data
        }, {

          "recipientID": recipientID2,
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
      headers: { "x-api-key": process.env.API_KEY },
      data: {
        "senderID": senderID2,
        "messages": [{
          "recipientID": recipientID,
          "data": data3
        }]
      },
      validateStatus: () => true
    }


    const response2 = await axios(request2)
    expect(response2.status).toEqual(204);


    const request3 = {
      url: baseURL + recipientID,
      method: "get",
      headers: { "x-api-key": process.env.API_KEY },
      validateStatus: () => true
    }

    const response3 = await axios(request3)
    expect(response3.status).toEqual(200);
    expect(response3.data.Count).toEqual(2);
    expect(response3.data.Items[0].recipientID).toEqual(recipientID);
    expect(response3.data.Items[0].senderID).toEqual(senderID);
    expect(response3.data.Items[0].data).toEqual(data);
    expect(response3.data.Items[1].recipientID).toEqual(recipientID);
    expect(response3.data.Items[1].senderID).toEqual(senderID2);
    expect(response3.data.Items[1].data).toEqual(data3);

    const request4 = {
      url: baseURL + recipientID2,
      method: "get",
      headers: { "x-api-key": process.env.API_KEY },
      validateStatus: () => true
    }
    const response4 = await axios(request4)
    expect(response4.status).toEqual(200);
    expect(response4.data.Count).toEqual(1);
    expect(response4.data.Items[0].recipientID).toEqual(recipientID2);
    expect(response4.data.Items[0].senderID).toEqual(senderID);
    expect(response4.data.Items[0].data).toEqual(data2);
  });

  it('should not put with wrong API key', async () => {
    const request1 = {
      url: baseURL,
      method: "put",
      headers: { "x-api-key": "Bad key" },
      data: "Does not matter",
      validateStatus: () => true
    }
    const response1 = await axios(request1)
    expect(response1.status).toEqual(403);

  })
});
