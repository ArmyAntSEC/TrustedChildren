const apiUtils = require('../../../src/utils/apiKeyHandling.js');
const ErrorResponse = require('../../../src/utils/ErrorResponse.js').ErrorResponse;

describe('Test verifyAPIKey', function () {
  it('should verify the standard API keys', async () => {
    process.env.HASHED_API_KEY = "ba2ef371838b7644589abb2e43876a11670891758a4cdd801225490d17e7f870";
    const event = { headers: { 'X-Api-Key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD" } };
    function verify() {
      apiUtils.verifyStandardKey(event);
    }
    expect(verify).not.toThrow();
  });

  it('should fail on the wrong standard API keys', async () => {
    process.env.HASHED_API_KEY = "WRONG_KEY_12345";
    const event = { headers: { 'X-Api-Key': "KLASDLKSDKLJASDLKJASLDKASLDKJKLASD" } };
    function verify() {
      apiUtils.verifyStandardKey(event);
    }
    expect(verify).toThrow(new ErrorResponse(403, "Forbidden"));
  });
})
