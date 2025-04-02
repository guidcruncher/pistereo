#!/bin/bash

rm -rf /app/mpvsocket
rm -rf /run/dbus
mkdir -p /run/dbus

if [ "$USEPIPEWIRE" == "yes" ]; then
dbus-daemon --system --print-address > /app/config/dbus-address
export DBUS_SESSION_BUS_ADDRESS=$(cat /app/config/dbus-address)

pipewire &
wireplumber &
fi 

cd /app

if [ ! -f /app/config/config.yml ]; then
cp /app/default.config /app/config/config.yml
fi

mpv -v --no-video --keep-open=yes --input-ipc-server=/app/socket/mpv --idle=yes &

./go-librespot --config_dir /app/config/

