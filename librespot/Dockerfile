# Use a multi-stage build to reduce the image size
# Stage 1: Build the application
FROM node:alpine as builder

RUN apk add --no-cache alsa-utils alsaconf alsa-lib alsa-lib-dev curl bash jq avahi-compat-libdns_sd sudo
RUN apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing librespot
RUN addgroup root audio
RUN addgroup -S sudo && adduser -S appuser && addgroup appuser sudo && addgroup appuser audio
RUN echo "%sudo      ALL=(ALL:ALL) NOPASSWD: ALL" >> /etc/sudoers
RUN echo "appuser    ALL=(ALL:ALL) NOPASSWD: ALL" >> /etc/sudoers

WORKDIR /librespot/app
RUN mkdir -p /librespot/tmp/
COPY eventhandler.sh .
COPY start.sh . 
RUN chmod +x ./eventhandler.sh ./start.sh

# Disable caching of credentials.
ENV LIBRESPOT_DISABLE_CREDENTIAL_CACHE=on
# Run PROGRAM set by `__onevent` before the sink is uopened and after it is closed.
ENV LIBRESPOT_EMIT_SINK_EVENTS=on
# Play all tracks at approximately the same apparent volume.
ENV LIBRESPOT_ENABLE_VOLUME_NORMALISATION=on
# Device name. Defaults to Librespot.
ENV LIBRESPOT_NAME=PiStereo
# Bitrate (kbps) {96|160|320}. Defaults to 160.
ENV LIBRESPOT_BITRATE=320
# Output format {F64|F32|S32|S24|S24_3|S16}. Defaults to S16.
ENV LIBRESPOT_FORMAT=F32
# Specify the dither algorithm to use {none|gpdf|tpdf|tpdf_hp}. Defaults to tpdf for formats S16, S24, S24_3 and none for other formats.
ENV LIBRESPOT_DITHER=none
# Displayed device type. Defaults to speaker.
ENV LIBRESPOT_DEVICE_TYPE=Speaker
# Path to a directory where files will be temporarily stored while downloading.
ENV LIBRESPOT_TMP=/librespot/tmp/download
# Path to a directory where files will be cached after downloading.
ENV LIBRESPOT_CACHE=/librespot/tmp/cache
# Path to a directory where system files (credentials, volume) will be cached. May be different from the `__cache` option value.
ENV LIBRESPOT_SYSTEM_CACHE=/librespot/tmp/systemcache
# Limits the size of the cache for audio files. Its possible to use suffixes like K, M or G, e.g. 16G for texample.
ENV LIBRESPOT_CACHE_SIZE_LIMIT=16G
# Audio backend to use. Use ? to list options.
ENV LIBRESPOT_BACKEND=rodio
# Run PROGRAM when a playback event occurs.
ENV LIBRESPOT_ONEVENT=/librespot/app/eventhandler.sh
# URL to use for Player Event Webhook requests
ENV WEBHOOK_URL=
# Timeout in seconds to wait for response from a Webhook event
ENV WEBHOOK_TIMEOUT=5

USER appuser

ENTRYPOINT [ "/bin/bash", "-e", "-c", "/librespot/app/start.sh" ]
