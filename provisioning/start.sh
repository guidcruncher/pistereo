#!/bin/bash

mkdir -p /cache/app
sudo setfacl -m u:appuser:rw /cache/*
sudo setfacl -m u:appuser:rw /dev/snd/*

cd "$BASE"/mediaserver

rm -rf ./socket/mpv

if [ "$NODE_ENV" == "production" ]; then
if [ ! -f ./config/config.yml ]; then
  cp "$BASE"/app/default-mediaserver.config ./config/config.yml
fi

if [ ! -f ./config/stationmappings.json ]; then
  cp "$BASE"/app/default-stationmappings.json ./config/stationmappings.json
fi

cd "$BASE"/app

if [ ! -f ./config/config.yaml ]; then
cp "$BASE"/app/default-server.config ./config/config.yaml
fi
fi

if [ "$NODE_ENV" == "development" ]; then
  cp ./mediaserver/config.yml ../mediaserver/config/
  rm -rf ./node_modules
  mkdir -p ./.npm
  npm i --cache ./.npm --force
  pm2 start /pistereo/app/ecosystem.config.js --env development
else
  pm2 start /pistereo/app/ecosystem.config.js --env production
fi

pm2 logs
