#!/bin/bash
# mplayer -vo null -ao alsa -framedrop "$1"
# mpv --no-video "$1"
# http://media-ice.musicradio.com/LBCUK
mpv -v --no-video --keep-open=yes --input-ipc-server=/app/mpvsocket --idle=yes "$1"
# https://www.reddit.com/r/mpv/comments/p8orya/ipc_socket_help_needed/
# pp# echo '{ command: [ "get_property", "path" ] }' | socat - ./mpvsocket
