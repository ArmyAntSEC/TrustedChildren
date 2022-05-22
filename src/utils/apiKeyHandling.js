const crypto = require('node:crypto');

verifyStandardKey = function (event) {
    const apiKey = event.headers['x-api-key']
    const hashedApiKey = process.env.HASHED_API_KEY;
    const hash = hashKey(apiKey);
    return hash === hashedApiKey;
}
exports.verifyStandardKey = verifyStandardKey;

function hashKey(apiKey) {
    const hasher = crypto.createHash('sha256');
    hasher.update(apiKey);
    let hash = hasher.digest('hex');
    console.log("Hashed API Key:", hash);
    return hash;
};
