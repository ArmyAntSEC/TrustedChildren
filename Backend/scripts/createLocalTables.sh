#!/bin/sh
aws dynamodb delete-table --table-name UuidAndPublicKeyMap --endpoint-url http://localhost:8000
aws dynamodb create-table --table-name UuidAndPublicKeyMap --attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000