#!/bin/bash

docker buildx create \
  --use --bootstrap \
  --driver docker-container \
  --name pistereoBuilder

docker buildx build . \
  --builder pistereoBuilder \
  -t guidcruncher/librespot:development \
  --no-cache \
  --pull \
  --push \
  --platform linux/arm64 \
  --platform linux/amd64

docker buildx rm pistereoBuilder
