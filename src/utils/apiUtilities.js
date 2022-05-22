const crypto = require('node:crypto');
const { syncBuiltinESMExports } = require('node:module');

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

class ErrorResponse extends Error {
    statusCode;
    body;

    constructor(statusCode, body) {
        super("Response: " + statusCode + " Body: " + body);
        this.statusCode = statusCode;
        this.body = body;
    }
}
exports.ErrorResponse = ErrorResponse;

exports.verifyProperMethod = function (event, method) {
    if (event.httpMethod !== method) {
        throw new exports.ErrorResponse(405, "Method not allowed");
    }
}

exports.handlerWrapper = async function (event, handler) {

    console.info('received:', event);
    verifyStandardKey(event);
    try {
        const data = await handler(event);
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (exception) {
        if (exception instanceof ErrorResponse) {
            return {
                statusCode: exception.statusCode,
                body: exception.body
            };
        } else {
            return {
                statusCode: 500,
                body: "Internal Server Error"
            };
        }
    }
}
