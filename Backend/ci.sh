#!/bin/sh

yarn test --coverage __tests__/unit/ --silent  && \
sam validate && \
sam build && \
aws dynamodb delete-table --table-name UuidAndPublicKeyMap --endpoint-url http://localhost:8000 && \
aws dynamodb create-table --table-name UuidAndPublicKeyMap --attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000 && \
aws dynamodb delete-table --table-name LastKnownPositionsTable --endpoint-url http://localhost:8000 && \
aws dynamodb create-table --table-name LastKnownPositionsTable --attribute-definitions AttributeName=recipientId,AttributeType=S AttributeName=senderId,AttributeType=S --key-schema AttributeName=recipientId,KeyType=HASH AttributeName=senderId,KeyType=RANGE --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000 && \
yarn test __tests__/live/ --config=__tests__/config/jest.local.config.js && \
sam deploy --no-fail-on-empty-changeset && \
yarn test __tests__/live/ --config=__tests__/config/jest.server.config.js


