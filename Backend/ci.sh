#!/bin/sh
docker-compose up &

yarn test --coverage __tests__/unit/ --silent && \
sam validate && \
sam build && \
#./scripts/testClaimPublicKeyAndUuid.sh && \
sam deploy --no-fail-on-empty-changeset && \
yarn test __tests__/live/
