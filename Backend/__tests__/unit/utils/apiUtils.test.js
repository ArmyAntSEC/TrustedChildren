const apiUtils = require('../../../src/utils/apiUtilities.js');
const ErrorResponse = require('../../../src/utils/ErrorResponse.js').ErrorResponse;
const utils = require("../utils.js");

describe('Test verifyProperMethod', function () {
  it('should accept the correct one', async () => {
    function verifyError() {
      const event = { httpMethod: "GET" };
      const method = "GET";
      apiUtils.verifyProperMethod(event, method)
    }
    expect(verifyError).not.toThrowError()
  });

  it('should not accept the wrong one', async () => {
    function verifyError() {
      const event = { httpMethod: "GET" };
      const method = "POST";
      apiUtils.verifyProperMethod(event, method)
    }

    expect(verifyError).toThrow(new ErrorResponse(405, "Method not allowed. Expected: POST Received: GET"))
  });

  describe('Test handlerWrapper', function () {
    it('should respond properly on success', async () => {
      const handler = function (_event) { return { "key": "value" } }
      const event = {
        headers: utils.getStandardHeaders()
      };

      const response = await apiUtils.handlerWrapper(event, handler);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(JSON.stringify({ "key": "value" }));
    });

    it('should respond properly on empty data', async () => {
      const handler = function (_event) { return null }
      const event = {
        headers: utils.getStandardHeaders()
      };

      const response = await apiUtils.handlerWrapper(event, handler);

      expect(response.statusCode).toEqual(204);
      expect(response.body).toEqual("");
    });

    it('should respond properly on expected failure', async () => {

      const handler = function (_event) { throw new ErrorResponse(404, "Error") }
      const event = {
        headers: utils.getStandardHeaders()
      };

      const response = await apiUtils.handlerWrapper(event, handler);

      expect(response.statusCode).toEqual(404);
      expect(response.body).toEqual("Error");
    });

    it('should respond properly on unxpected failure', async () => {

      const handler = function (_event) { throw new Error("Specific Error") }
      const event = {
        headers: utils.getStandardHeaders()
      };

      const response = await apiUtils.handlerWrapper(event, handler);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual("Cought internal error: Specific Error");
    });

  })

})