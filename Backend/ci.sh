#!/bin/sh
npm test -- --coverage __tests__/unit/ && \
sam validate && \
sam build && \
sam deploy --no-fail-on-empty-changeset && \
npm test -- __tests__/live/
