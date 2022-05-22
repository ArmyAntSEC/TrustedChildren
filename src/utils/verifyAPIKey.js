const crypto = require('node:crypto');

const hasher = crypto.createHash('sha256');

function hashKey(apiKey) {
    hasher.update(apiKey);
    let hash = hasher.digest('hex');
    return hash;
};

function verifyStandardKey(apiKey) {
    let hash = hashKey(apiKey);
    return hash === "c8b51b731a62386fd89d9598fb3508c2ff396b91282a888fad66bc615a4771ba";
}

exports.hashKey = hashKey;
exports.verifyStandardKey = verifyStandardKey;