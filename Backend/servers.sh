#!/bin/sh
docker-compose up &
sam local start-api &
