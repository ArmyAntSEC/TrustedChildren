#!/bin/sh
echo "------"
randomKey=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w ${1:-20} | head -n 1)
randomUuid=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w ${1:-20} | head -n 1)
#item="{\"PK\":{\"S\":\"PUBKEY#RandomPubKey$randomKey\"},\"SK\":{\"S\":\"PUBKEY#RandomPubKey$randomKey\"},\"uuid\":{\"S\":\"RandomUUID$randomUuid\"}}"
aws dynamodb put-item --table-name UuidAndPublicKeyMap --item file://./scripts/item.json --condition-expression "attribute_not_exists(PK)" --endpoint-url http://localhost:8000
echo "------"
aws dynamodb scan --table-name UuidAndPublicKeyMap --endpoint-url http://localhost:8000
echo "------"
#sam local invoke claimPublicKeyAndUuidFunction -e events/eventClaimPublicKeyAndUuid.json