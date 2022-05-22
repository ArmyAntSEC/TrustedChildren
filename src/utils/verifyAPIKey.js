const crypto = require('node:crypto');
const hashedApiKey = process.env.HASHED_API_KEY;

function hashKey(apiKey) {
    const hasher = crypto.createHash('sha256');
    hasher.update(apiKey);
    let hash = hasher.digest('hex');
    console.log("Hashed API Key:", hash);
    return hash;
};

function verifyStandardKey(apiKey) {
    let hash = hashKey(apiKey);
    return hash === hashedApiKey;
}

exports.hashKey = hashKey;
exports.verifyStandardKey = verifyStandardKey;