#!/bin/bash

payload=$(jq -c -n --arg event "$PLAYER_EVENT" \
      --arg track "$TRACK_ID" \
      --arg oldtrack "$OLD_TRACK_ID" \
      '{"playerEvent": $ARGS.named["event"], "trackId": $ARGS.named["track"], "oldTrackId": $ARGS.named["oldtrack"]}')

echo "  Spotify event: ---------------------------------------------"
echo "    PLAYER_EVENT:  $PLAYER_EVENT"
echo "    TRACK_ID:      $TRACK_ID"
echo "    OLD_TRACK_ID:  $OLD_TRACK_ID"
echo "    WEBHOOK_DATA:  $payload"

if [ -n "$WEBHOOK_URL" ]; then
echo "** Sending Webhook to POST $WEBHOOK_URL"
curl --header "Content-Type: application/json" \
     --request POST \
     --connect-timeout "$WEBHOOK_TIMEOUT"
     --data "$payload" \
     "$WEBHOOK_URL"
else
  echo "** ERROR: Webhook not sent, WEBHOOK_URL Is empty. **"
fi
