#!/bin/sh

npm test -- __tests__/unit/ && \
sam validate && \
sam build && \
sam deploy && \
npm test -- __tests__/live/

