#!/bin/bash

cd "$BASE"/mediaserver

mpv -v --alsa-mixer-device="$ALSA_MIXER_DEVICE" --no-video --keep-open=yes --input-ipc-server="$MPV_SOCKET" --idle=yes --display-tags-clr --msg-level=cplayer=error --no-terminal
