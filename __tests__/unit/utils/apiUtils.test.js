const apiUtils = require('../../../src/utils/apiUtilities.js');

describe('Test verifyAPIKey', function () {
    it('should verify the standard API keys', async () => {
        process.env.HASHED_API_KEY = "ba2ef371838b7644589abb2e43876a11670891758a4cdd801225490d17e7f870";
        let hashMatches = apiUtils.verifyStandardKey("KLASDLKSDKLJASDLKJASLDKASLDKJKLASD");
        expect(hashMatches).toBeTruthy();
    });
})

describe('Test verifyProperMethod', function () {
    it('should accept the correct one', async () => {
        function verifyError() {
            let event = { httpMethod: "GET" };
            let method = "GET";
            apiUtils.verifyProperMethod(event, method)
        }
        expect(verifyError).not.toThrowError()
    });

    it('should not accept the wrong one', async () => {
        function verifyError() {
            let event = { httpMethod: "GET" };
            let method = "POST";
            apiUtils.verifyProperMethod(event, method)
        }

        expect(verifyError).toThrow(new apiUtils.ErrorResponse(405, "Method not allowed"))
    });
})