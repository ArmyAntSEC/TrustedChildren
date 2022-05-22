process.env.HASHED_API_KEY = "ba2ef371838b7644589abb2e43876a11670891758a4cdd801225490d17e7f870";
const verifyApiKey = require('../../../src/utils/verifyAPIKey.js');

describe('Test verifyAPIKey', function () {
    it('should hash API keys', async () => {
        let hash = verifyApiKey.hashKey("KLASDLKSDKLJASDLKJASLDKASLDKJKLASD");
        expect(hash).toEqual("ba2ef371838b7644589abb2e43876a11670891758a4cdd801225490d17e7f870");
    });

    it('should verify the standard API keys', async () => {
        let hashMatches = verifyApiKey.verifyStandardKey("KLASDLKSDKLJASDLKJASLDKASLDKJKLASD");
        expect(hashMatches).toEqual(true);
    });
})