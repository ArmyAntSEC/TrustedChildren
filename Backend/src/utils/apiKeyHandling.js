const crypto = require('node:crypto');
const ErrorResponse = require('./ErrorResponse.js').ErrorResponse;

exports.verifyStandardKey = function (event) {
  const apiKey = event.headers['X-Api-Key']
  if (apiKey === undefined) {
    throw new ErrorResponse(400, "X-Api-Key header not provided");
  }
  const hashedApiKey = process.env.HASHED_API_KEY;
  const hash = hashKey(apiKey);
  if (hash !== hashedApiKey) {
    console.error("API key sent: " + apiKey + " Hashed API key expected: " + hashedApiKey);
    throw new ErrorResponse(403, "Forbidden");
  }
}

function hashKey(apiKey) {
  const hasher = crypto.createHash('sha256');
  hasher.update(apiKey);
  return hasher.digest('hex');
}
