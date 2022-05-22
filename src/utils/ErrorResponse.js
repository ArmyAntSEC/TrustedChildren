exports.ErrorResponse = class extends Error {
    statusCode;
    body;

    constructor(statusCode, body) {
        super("Response: " + statusCode + " Body: " + body);
        this.statusCode = statusCode;
        this.body = body;
    }
}
