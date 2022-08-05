const verifyStandardKey = require('./apiKeyHandling.js').verifyStandardKey;
const ErrorResponse = require('./ErrorResponse.js').ErrorResponse;

exports.createDocClient = function () {
  const dynamodb = require("aws-sdk/clients/dynamodb");

  let options = {};

  if (process.env.AWS_SAM_LOCAL) {
    const AWS = require("aws-sdk")
    options.endpoint = new AWS.Endpoint("http://host.docker.internal:8000");
    console.debug("Using local AWS endpoint.");
  }

  return new dynamodb.DocumentClient(options);
}

exports.verifyProperMethod = function (event, method) {
  if (event.httpMethod !== method) {
    throw new ErrorResponse(405, "Method not allowed. Expected: " + method + " Received: " + event.httpMethod);
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
    console.error(JSON.stringify(exception, ["message", "arguments", "type", "name"]));

    if (exception instanceof ErrorResponse) {
      return response(exception.statusCode, exception.body)
    } else {
      return response(500, "Cought internal error: " + exception.message)
    }
  }
}

function response(code, body) {
  return {
    statusCode: code,
    body: body
  };
}