const crypto = require('node:crypto');

exports.verifyStandardKey = function (event) {
    const apiKey = event.headers['x-api-key']
    const hashedApiKey = process.env.HASHED_API_KEY;
    const hash = hashKey(apiKey);
    return hash === hashedApiKey;
}

function hashKey(apiKey) {
    const hasher = crypto.createHash('sha256');
    hasher.update(apiKey);
    let hash = hasher.digest('hex');
    console.log("Hashed API Key:", hash);
    return hash;
};

exports.ErrorResponse = class extends Error {
    statusCode;
    body;

    constructor(statusCode, body) {
        super("Response: " + statusCode + " Body: " + body);
        this.statusCode = statusCode;
        this.body = body;
    }
}

exports.verifyProperMethod = function (event, method) {
    if (event.httpMethod !== method) {
        throw new exports.ErrorResponse(405, "Method not allowed");
    }
}
