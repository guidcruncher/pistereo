FROM alpine:latest AS base

RUN apk add --no-cache curl bash jq

RUN apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing librespot

RUN mkdir -p /librespot/tmp/download /librespot/tmp/cache /librespot/tmp/systemcache /librespot/app

WORKDIR /librespot/app

COPY ./start.sh ./start.sh
COPY ./eventhandler.sh ./eventhandler.sh

RUN chmod +x ./start.sh ./eventhandler.sh

# Disable autoplay of tracks
# ENV LIBRESPOT_AUTOPLAY=on
# Disable caching of the audio data.
# ENV LIBRESPOT_DISABLE_AUDIO_CACHE=on
# Disable caching of credentials.
ENV LIBRESPOT_DISABLE_CREDENTIAL_CACHE=on
# Disable gapless playback.
# ENV LIBRESPOT_DISABLE_GAPLESS=on
# Run PROGRAM set by `__onevent` before the sink is uopened and after it is closed.
ENV LIBRESPOT_EMIT_SINK_EVENTS=on
# Play all tracks at approximately the same apparent volume.
ENV LIBRESPOT_ENABLE_VOLUME_NORMALISATION=on
# Device name. Defaults to Librespot.
ENV LIBRESPOT_NAME=PiStereo
# Bitrate (kbps) {96|160|320}. Defaults to 160.
ENV LIBRESPOT_BITRATE=160
# Output format {F64|F32|S32|S24|S24_3|S16}. Defaults to S16.
ENV LIBRESPOT_FORMAT=S16
# Specify the dither algorithm to use {none|gpdf|tpdf|tpdf_hp}. Defaults to tpdf for formats S16, S24, S24_3 and none for other formats.
ENV LIBRESPOT_DITHER=tpdf
# Displayed device type. Defaults to speaker.
ENV LIBRESPOT_DEVICE_TYPE=Speaker
# Path to a directory where files will be temporarily stored while downloading.
ENV LIBRESPOT_TMP="/librespot/tmp/download"
# Path to a directory where files will be cached after downloading.
ENV LIBRESPOT_CACHE="/librespot/tmp/cache"
# Path to a directory where system files (credentials, volume) will be cached. May be different from the `__cache` option value.
ENV LIBRESPOT_SYSTEM_CACHE="/librespot/tmp/systemcache"
# Limits the size of the cache for audio files. Its possible to use suffixes like K, M or G, e.g. 16G for texample.
ENV LIBRESPOT_CACHE_SIZE_LIMIT=16G
# Audio backend to use. Use ? to list options.
ENV LIBRESPOT_BACKEND=rodio
# Spotify access token to sign in with.
#ENV LIBRESPOT_ACCESS_TOKEN=
# Run PROGRAM when a playback event occurs.
ENV LIBRESPOT_ONEVENT=/librespot/app/eventhandler.sh
# Alsa mixer control, e.g. PCM, Master or similar. Defaults to PCM.
ENV LIBRESPOT_ALSA_MIXER_CONTROL=PCM
# Alsa mixer device, e.g hw:0 or similar from `aplay _l`. Defaults to `__device` if specified, default otherwise.
ENV LIBRESPOT_ALSA_MIXER_DEVICE="sysdefault:CARD=Headphones"
# Alsa index of the cards mixer. Defaults to 0.
ENV LIBRESPOT_ALSA_MIXER_INDEX=0
# Mixer to use {alsa|softvol}. Defaults to softvol.
ENV LIBRESPOT_MIXER=alsa
# Audio device to use. Use ? to list options if using alsa, portaudio or rodio. Defaults to the backends default.
ENV LIBRESPOT_DEVICE="default:CARD=Headphones"
# Initial volume in % from 0 - 100. Default for softvol:50. For the alsa mixer: the current volume.
ENV LIBRESPOT_INITIAL_VOLUME=100
# Volume control scale type {cubic|fixed|linear|log}. Defaults to log.
ENV LIBRESPOT_VOLUME_CTRL=log
# Range of the volume control (dB) from 0.0 to 100.0.  Default for softvol: 60.0. F or the alsa mixer: what the control supports.
ENV LIBRESPOT_VOLUME_RANGE=60.0
# Specify the normalisation method to use {basic|dynamic}. Defaults to dynamic.
ENV LIBRESPOT_NORMALISATION_METHOD=dynamic
# Specify the normalisation gain type to use {track|album|auto}. Defaults to auto.
ENV LIBRESPOT_NORMALISATION_GAIN_TYPE=auto
# Pregain (dB) applied by volume normalisation from -10.0 to 10.0. Defaults to 0.0.
ENV LIBRESPOT_NORMALISATION_PREGAIN=6.0
# Threshold (dBFS) at which point the dynamic limiter engages to prevent clipping from 0.0 to -10.0. Defaults to -2.0.
ENV LIBRESPOT_NORMALISATION_THRESHOLD=-2
# Attack time (ms) in which the dynamic limiter reduces gain from 1 to 500. Defaults to 5.
ENV LIBRESPOT_NORMALISATION_ATTACK=5
# Release or decay time (ms) in which the dynamic limiter restores gain from 1 to 1000. Defaults to 100.
ENV LIBRESPOT_NORMALISATION_RELEASE=100
# Knee width (dB) of the dynamic limiter from 0.0 to 10.0. Defaults to 5.0.
ENV LIBRESPOT_NORMALISATION_KNEE=5.0

# URL to use for Player Event Webhook requests
ENV WEBHOOK_URL=
# Timeout in seconds to wait for response from a Webhook event
ENV WEBHOOK_TIMEOUT=5

ENTRYPOINT [ "/bin/bash", "-e", "-c", "/librespot/app/start.sh" ]
