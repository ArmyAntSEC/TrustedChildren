#!/bin/sh
aws dynamodb put-item \
    --table-name sam-trusted-children-PublicKeyAndUuidMappingTable-14B9RI8D4QASS \
    --item '{
        "PK": {"S": "PUBKEY#TestPublicKey58827738"},
        "SK": {"S": "PUBKEY#TestPublicKey58827738"} ,
        "uuid": {"S": "TestUuid59901139"},
        "message": {"S": "From Command Line part 3"}
      }' \
    --condition-expression "attribute_not_exists(PK)" \
    --return-values ALL_OLD