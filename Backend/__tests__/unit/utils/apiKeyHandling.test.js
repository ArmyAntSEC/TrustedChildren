const apiUtils = require('../../../src/utils/apiKeyHandling.js');
const ErrorResponse = require('../../../src/utils/ErrorResponse.js').ErrorResponse;
const utils = require("../utils.js");

describe('Test verifyAPIKey', function () {
  it('should verify the standard API keys', async () => {
    const event = {
      headers: utils.getStandardHeaders()
    };

    function verify() {
      apiUtils.verifyStandardKey(event);
    }
    expect(verify).not.toThrow();
  });

  it('should fail on the wrong standard API keys', async () => {

    process.env.HASHED_API_KEY = "WRONG_KEY_12345";

    const event = {
      headers: utils.getStandardHeaders()
    };

    function verify() {
      apiUtils.verifyStandardKey(event);
    }
    expect(verify).toThrow(new ErrorResponse(403, "Forbidden"));
  });
})
