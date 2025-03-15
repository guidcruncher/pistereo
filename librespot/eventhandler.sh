#!/bin/bash
paylosd="";

case "$PLAYER_EVENT" in
changed)
  payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
  --arg track "$TRACK_ID" \
  --arg oldtrack "$OLD_TRACK_ID" \
  --arg uri "$URI" \
  --arg name "$NAME" \
  --arg duration "$DURATION_MS" \
  --arg covers "$(echo $COVERS | sed 's/\n/,/g')" \
  '{"playerEvent": $ARGS.named["event"], "trackId": $ARGS.named["track"], "oldTrackId": $ARGS.named["oldtrack"], "uri": $ARGS.named["uri"], "name": $ARGS.named["name"], "duration": $ARGS.named["duration"], "covers": $ARGS.named["covers"]}')
  ;;
unavailable)
end_of_track)
preload_next)
loading)
preloading)
started)
stopped)
payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
--arg track "$TRACK_ID" \
'{"playerEvent": $ARGS.named["event"], "trackId": $ARGS.named["track"]}')
;;
playing)
paused)
payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
--arg track "$TRACK_ID" \
--arg duration "$DURATION_MS" \
--arg progress "$POSITION_MS" \
'{"playerEvent": $ARGS.named["event"], "trackId": $ARGS.named["track"], "duration": $ARGS.named["duration"], "progress": $ARGS.named["progress"]}')
;;
seek)
position_correction)
payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
--arg progress "$POSITION_MS" \
'{"playerEvent": $ARGS.named["event"], "position": $ARGS.named["position"]}')
 ;;
volume_set)
payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
--arg volume "$VOLUME" \
'{"playerEvent": $ARGS.named["event"], "volume": $ARGS.named["volume"]}')
;;
*)
payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
'{"playerEvent": $ARGS.named["event"]}')
esac

echo "  Spotify event: ---------------------------------------------"
echo "    PLAYER_EVENT:  $PLAYER_EVENT"
echo "    TRACK_ID:      $TRACK_ID"
echo "    OLD_TRACK_ID:  $OLD_TRACK_ID"
echo "    WEBHOOK_DATA:  $payload"

if [ -n "$WEBHOOK_URL" ]; then
echo "** Sending Webhook to POST $WEBHOOK_URL"
curl -X 'POST' \
  "$WEBHOOK_URL" \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d "$payload" \
  --connect-timeout "$WEBHOOK_TIMEOUT"
fi
