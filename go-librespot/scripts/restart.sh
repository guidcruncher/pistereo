#!/bin/bash
docker compose -f ./docker-compose.yaml stop
docker compose -f ./docker-compose.yaml rm -f
docker compose -f ./docker-compose.yaml up --remove-orphans --build -d
