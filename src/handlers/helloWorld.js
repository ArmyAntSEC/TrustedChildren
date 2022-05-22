const verifyApiKey = require('../utils/apiUtilities.js');

exports.helloWorld = async (event, context) => {
    if (!verifyApiKey.verifyStandardKey(event)) {
        throw new Error("Invalid API Key provided");
    }

    let response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: 'hello world',
        })
    }
    return response
};
