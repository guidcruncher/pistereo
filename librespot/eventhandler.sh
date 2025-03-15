#!/bin/bash
paylosd=""

case "$PLAYER_EVENT" in
track_changed)
        coverarr="[]"
        if [ -n "$COVERS" ]; then
          coverarr=$(printf $COVERS | jq -R -s -c 'split("\n")')
        fi

	payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
		--arg track "$TRACK_ID" \
		--arg oldtrack "$OLD_TRACK_ID" \
		--arg uri "$URI" \
		--arg name "$NAME" \
		--arg duration "$DURATION_MS" \
		--arg covers "$coverarr" \
		'{"playerEvent": $ARGS.named["event"], "trackId": $ARGS.named["track"], "oldTrackId": $ARGS.named["oldtrack"], "uri": $ARGS.named["uri"], "name": $ARGS.named["name"], "duration": $ARGS.named["duration"]|tonumber, "covers": $ARGS.named["covers"]|fromjson}')
	;;
unavailable | end_of_track | preload_next | loading | preloading | started | stopped)
	payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
		--arg track "$TRACK_ID" \
		'{"playerEvent": $ARGS.named["event"], "trackId": $ARGS.named["track"]}')
	;;
playing | paused | seeked | position_correction)
	payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
		--arg track "$TRACK_ID" \
		--arg progress "$POSITION_MS" \
		'{"playerEvent": $ARGS.named["event"], "trackId": $ARGS.named["track"], "progress": $ARGS.named["progress"]|tonumber}')
	;;
volume_changed)
	payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
		--arg volume "$VOLUME" \
		'{"playerEvent": $ARGS.named["event"], "volume": $ARGS.named["volume"]|tonumber}')
	;;
*)
	payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
		'{"playerEvent": $ARGS.named["event"]}')
	;;
esac

echo " Spotify event: ---------------------------------------------"
echo "  EVENT:   $PLAYER_EVENT"
echo "  PAYLOAD: $payload"

if [ -n "$WEBHOOK_URL" ]; then
        if [ -n "$payload" ]; then
          echo "** Sending Webhook to POST $WEBHOOK_URL"
	  curl -X 'POST' \
		"$WEBHOOK_URL" \
		-H 'accept: */*' \
		-H 'Content-Type: application/json' \
		-d "$payload" \
		--connect-timeout "$WEBHOOK_TIMEOUT"
        fi
fi
