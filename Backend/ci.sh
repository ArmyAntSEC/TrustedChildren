#!/bin/sh
yarn test -- __tests__/unit/ && \
sam validate && \
sam build && \
sam deploy && \
yarn test -- __tests__/live/