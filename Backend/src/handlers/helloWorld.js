const verifyStandardKey = require('../utils/apiKeyHandling.js').verifyStandardKey;

exports.helloWorld = async (event, _context) => {
    verifyStandardKey(event);

    return {
        'statusCode': 200,
        'body': JSON.stringify({
            message: 'hello world',
        })
    }    
};
