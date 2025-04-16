#!/bin/bash

envsubst <  "$BASE"/mediaserver/default-mediaserver.config > "$BASE"/mediaserver/config/config.yml

cd "$BASE"/mediaserver
./go-librespot --config_dir "$BASE"/mediaserver/config/
