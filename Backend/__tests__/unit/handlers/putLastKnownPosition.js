const putLastKnownPosition = require('../../../src/handlers/putLastKnownPosition.js');
const dynamodb = require('aws-sdk/clients/dynamodb');

// This includes all tests for putItemHandler() 
describe('Test putItemsHandler', function () {
  let putSpy;

  beforeEach(() => {
    putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');

    putSpy.mockReturnValue({
      promise: () => Promise.resolve(null)
    });
  });

  afterEach(() => {
    putSpy.mockRestore();
  });

  it('should add a single id to the table', async () => {
    const sentItem = {
      senderID: 'id2',
      messages: [{
        recipientID: 'id1',
        data: 'data'
      }]
    };

    await doActualCallAndCheckReturn(sentItem);

    const params1 = {
      TableName: undefined,
      Item: {
        senderID: sentItem.senderID,
        recipientID: sentItem.messages[0].recipientID,
        data: sentItem.messages[0].data
      }
    };

    expect(putSpy).toHaveBeenCalledTimes(1);
    expect(putSpy).toHaveBeenNthCalledWith(1, params1);
  });

  it('should add two ids to the table', async () => {
    const sentItem = {
      senderID: 'id2',
      messages: [{
        recipientID: 'id1',
        data: 'data'
      }, {
        recipientID: 'id3',
        data: 'more data'
      }]
    };

    await doActualCallAndCheckReturn(sentItem);

    const params1 = {
      TableName: undefined,
      Item: {
        senderID: sentItem.senderID,
        recipientID: sentItem.messages[0].recipientID,
        data: sentItem.messages[0].data
      }
    };

    const params2 = {
      TableName: undefined,
      Item: {
        senderID: sentItem.senderID,
        recipientID: sentItem.messages[1].recipientID,
        data: sentItem.messages[1].data
      }
    };


    expect(putSpy).toHaveBeenCalledTimes(2);
    expect(putSpy).toHaveBeenNthCalledWith(1, params1);
    expect(putSpy).toHaveBeenNthCalledWith(2, params2);
  });


});


const doActualCallAndCheckReturn = async function (sentItem) {
  const event = {
    httpMethod: 'PUT',
    body: JSON.stringify(sentItem),
    headers: {
      'x-api-key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD"
    }
  };

  const result = await putLastKnownPosition.handler(event);
  const expectedResult = {
    statusCode: 204,
    body: ""
  };
  expect(result).toEqual(expectedResult);
}

