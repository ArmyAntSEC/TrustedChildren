const apiUtils = require('./apiKeyHandling.js');

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
        if (data === null) {
            return response(204, "");
        } else {
            return response(200, JSON.stringify(data))
        }
    } catch (exception) {
        if (exception instanceof ErrorResponse) {
            return response(exception.statusCode, exception.body)
        } else {
            return response(500, "Internal Server Error")
        }
    }
}

function response(code, body) {
    return {
        statusCode: code,
        body: body
    };
}