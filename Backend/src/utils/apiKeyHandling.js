const crypto = require('node:crypto');
const ErrorResponse = require('./ErrorResponse.js').ErrorResponse;

exports.verifyStandardKey = function (event) {
    const apiKey = event.headers['x-api-key']
    const hashedApiKey = process.env.HASHED_API_KEY;
    const hash = hashKey(apiKey);
    if (hash !== hashedApiKey) {
        throw new ErrorResponse(403, "Forbidden");
    }
}

function hashKey(apiKey) {
    const hasher = crypto.createHash('sha256');
    hasher.update(apiKey);
    return hasher.digest('hex');
}
