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
docker buildx build . \
  --builder pistereoBuilder \
  -t guidcruncher/$package:build \
  --no-cache \
  --pull \
  --output type=docker \
  --platform linux/arm64 
else
tags="guidcruncher/$package:latest,guidcruncher/$package:development,guidcruncher/$package:$packageversion"
echo $tags
docker buildx build . \
  --builder pistereoBuilder \
  -t guidcruncher/$package:build \
  --no-cache \
  --pull \
  --output type=docker \
  --platform linux/arm64 \
  --platform linux/amd64
fi


echo $tags | tr "," "\n"
for t in $(echo $tags | tr "," "\n"); do
    docker image tag "guidcruncher/$package:build" "$t"
done

docker rmi "guidcruncher/$package:build"

for t in $(echo $tags | tr "," "\n"); do
docker image push "$t" 
done
docker buildx rm pistereoBuilder

