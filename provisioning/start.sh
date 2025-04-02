#!/bin/bash

cd /usr/src/mediaserver

rm -rf ./socket/mpv

if [ ! -f ./config/config.yml ]; then
  cp ./default.config ./config/config.yml
fi

sudo mpv -v --no-video --keep-open=yes --input-ipc-server=/usr/src/mediaserver/socket/mpv --idle=yes &

./go-librespot --config_dir /usr/src/mediaserver/config/ &

cd /usr/src/app

if [ "$NODE_ENV" == "development" ]; then
  rm -rf ./node_modules
  npm i
  npm run  start:dockerdev
else
  npm run start:prod
fi
