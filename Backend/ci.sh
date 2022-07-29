#!/bin/sh
docker-compose up &

yarn test --coverage __tests__/unit/ --silent && \
./scripts/testClaimPublicKeyAndUuid.sh && \
sam validate && \
sam build && \
sam deploy --no-fail-on-empty-changeset && \
yarn test __tests__/live/
