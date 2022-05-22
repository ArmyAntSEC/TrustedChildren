const crypto = require('node:crypto');

const hasher = crypto.createHash('sha256');

function verifyKey(apiKey) {
    console.log("API Key: ", apiKey);
    hasher.update(apiKey);
    let hash = hasher.digest('hex');
    console.log(hash);
    return hash;
};

exports.verifyKey = verifyKey;