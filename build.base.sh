#!/bin/bash

package="pistereo-base"
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
docker buildx build - ./Dockerfile.base . \
  --builder pistereoBuilder \
  -t guidcruncher/$package:development \
  --no-cache \
  --pull \
  --push \
  --platform linux/arm64 
else
tags="guidcruncher/$package:latest,guidcruncher/$package:$packageversion"
echo $tags
docker buildx build -f ./Dockerfile.base . \
  --builder pistereoBuilder \
  -t guidcruncher/$package:latest \
  --no-cache \
  --pull \
  --push \
  --platform linux/arm64
fi

docker buildx rm pistereoBuilder

