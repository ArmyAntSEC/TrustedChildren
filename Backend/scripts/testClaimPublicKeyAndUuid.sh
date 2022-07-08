#!/bin/sh
echo "------"
randomKey=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w ${1:-20} | head -n 1)
randomUuid=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w ${1:-20} | head -n 1)
aws dynamodb transact-write-items --transact-items file://./scripts/item.json --endpoint-url http://localhost:8000
echo "------"
aws dynamodb scan --table-name UuidAndPublicKeyMap --endpoint-url http://localhost:8000
echo "------"
#sam local invoke claimPublicKeyAndUuidFunction -e events/eventClaimPublicKeyAndUuid.json