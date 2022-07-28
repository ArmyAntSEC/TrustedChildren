#!/bin/sh
echo "\n***** Resetting database.\n"
aws dynamodb delete-table --table-name UuidAndPublicKeyMap --endpoint-url http://localhost:8000
aws dynamodb create-table --table-name UuidAndPublicKeyMap --attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000
echo "\n------ Creating randomized event to test local transaction.\n"
cat ./scripts/itemTemplate.json | randomKey=$(openssl rand -base64 21) randomUuid=$(openssl rand -base64 21) envsubst > ./scripts/item.json
echo "\n------ Storing randomized event to local database directly.\n"
aws dynamodb transact-write-items --transact-items file://./scripts/item.json --endpoint-url http://localhost:8000
echo "\n------ Dumping local database content \n"
aws dynamodb scan --table-name UuidAndPublicKeyMap --endpoint-url http://localhost:8000
echo "\n------ Building and then invoking local lambda to put event in database.\n"
sam build
sam local invoke claimPublicKeyAndUuidFunction -e events/eventClaimPublicKeyAndUuid.json
echo "\n------ Dumping local database again. 4 items should be there.\n"
aws dynamodb scan --table-name UuidAndPublicKeyMap --endpoint-url http://localhost:8000