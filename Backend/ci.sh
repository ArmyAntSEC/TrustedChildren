#!/bin/sh
yarn test -- __tests__/unit/ && \
sam validate && \
sam build && \
sam deploy --no-fail-on-empty-changeset && \
yarn test -- __tests__/live/