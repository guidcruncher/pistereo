#!/bin/bash

TARGET="$MPV_SOCKET"

if [ -z "$TARGET" ]; then
  TARGET="./socket/mpv"
fi

CMD=""

case "$1" in
load)
  CMD="{ command: [ \"loadfile\", \"$2\", \"replace\" ] }"
  ;;
play)
  CMD="{ command: [ \"cycle\", \"play\" ] }"
  ;;
pause)
  CMD="{ command: [ \"cycle\", \"pause\" ] }"
  ;;
stop)
  CMD="{ command: [ \"stop\" ] }"
  ;;
volume)
  CMD="{ command: [ \"set_property\", \"volume\", \"$2\" ] }"
  ;;
mute)
  CMD="{ command: [ \"set_property\", \"volume\", 0 ] }"
  ;;
unmute)
  CMD="{ command: [ \"set_property\", \"volume\", 80 ] }"
  ;;
get-property)
  CMD="{ command: [ \"get_property\", \"$2\" ] }"
  ;;
*)
  echo "Format:"
  echo "mplayer.sh {cmd} {parameters}"
  echo "Where {cmd} can be  load, play, pause, stop, volume, mute, unmute, get-property"
  exit 1
esac

echo ""
echo "Invoking '$CMD' on socket '$TARGET'"
echo ""
echo "$CMD" |  socat - "$TARGET"
echo ""
