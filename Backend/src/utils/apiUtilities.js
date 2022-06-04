const apiUtils = require('./apiKeyHandling.js');
const ErrorResponse = require('./ErrorResponse.js').ErrorResponse;

exports.verifyProperMethod = function (event, method) {
    if (event.httpMethod !== method) {
        throw new ErrorResponse(405, "Method not allowed");
    }
}


exports.handlerWrapper = async function (event, handler) {
    try {
        verifyStandardKey(event);

        const data = await handler(event);
        if (data === null || data === undefined) {
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