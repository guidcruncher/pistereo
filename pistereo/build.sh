#!/bin/bash

packageversion=$(cat ./package.json | jq -r '.version')
package=$(cat ./package.json | jq -r '.name')
prodbuild="$1"

if [ -b  "$prodbuild" ]; then
  prodbuild="dev"
fi

echo $prodbuild

docker buildx create \
  --use --bootstrap \
  --driver docker-container \
  --name pistereoBuilder

if [ "$prodbuild" == "dev" ]; then
tags="guidcruncher/$package:development"
echo $tags
docker buildx build -f ./Dockerfile.dev . \
  --builder pistereoBuilder \
  -t guidcruncher/$package:development \
  --no-cache \
  --pull \
  --push \
  --platform linux/arm64 
else
tags="guidcruncher/$package:latest,guidcruncher/$package:$packageversion"
echo $tags
docker buildx build ./Dockerfile-producction . \
  --builder pistereoBuilder \
  -t guidcruncher/$package:latest \
  -t guidcruncher/$package:$packageversion \
  --no-cache \
  --pull \
  --push \
  --platform linux/arm64 \
  --platform linux/amd64
fi

docker buildx rm pistereoBuilder

