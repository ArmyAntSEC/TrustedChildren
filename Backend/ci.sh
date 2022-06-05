#!/bin/sh
yarn test -- --coverage __tests__/unit/ && \
sam validate && \
sam build && \
sam deploy --no-fail-on-empty-changeset && \
yarn test -- __tests__/live/
