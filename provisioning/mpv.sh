#!/bin/bash

cd "$BASE"/mediaserver

mpv -v --no-video --keep-open=yes --input-ipc-server="$MPV_SOCKET" --idle=yes



