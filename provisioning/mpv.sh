#!/bin/bash

cd "$BASE"/mediaserver

mpv -v --alsa-mixer-device=equal --no-video --keep-open=yes --input-ipc-server="$MPV_SOCKET" --idle=yes --display-tags-clr --msg-level=cplayer=error --no-terminal
