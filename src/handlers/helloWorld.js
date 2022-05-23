const verifyStandardKey = require('../utils/apiKeyHandling.js').verifyStandardKey;

exports.helloWorld = async (event, context) => {
    verifyStandardKey(event);

    let response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: 'hello world',
        })
    }

    return response
};
