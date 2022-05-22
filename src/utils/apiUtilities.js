const crypto = require('node:crypto');

function verifyStandardKey(apiKey) {
    const hashedApiKey = process.env.HASHED_API_KEY;
    let hash = hashKey(apiKey);
    return hash === hashedApiKey;
}

function hashKey(apiKey) {
    const hasher = crypto.createHash('sha256');
    hasher.update(apiKey);
    let hash = hasher.digest('hex');
    console.log("Hashed API Key:", hash);
    return hash;
};

exports.verifyStandardKey = verifyStandardKey;

exports.ErrorResponse = class extends Error {
    responseCode;
    body;

    constructor(responseCode, body) {
        super("Response: " + responseCode + " Body: " + body);
        this.responseCode = responseCode;
        this.body = body;
    }
}

function verifyProperMethod(event, method) {
    if (event.httpMethod !== method) {
        throw new exports.ErrorResponse(405, "Method not allowed");
    }
}

exports.verifyProperMethod = verifyProperMethod;
