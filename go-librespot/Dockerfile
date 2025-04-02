FROM node:lts-bullseye-slim
# FROM debian:stable-slim AS base
# FROM debian:latest AS base
ARG DEBIAN_FRONTEND=noninteractive
ARG TARGETARCH

RUN <<EOF
 apt update > /dev/null
 apt install -y ca-certificates > /dev/null
 apt install -y --no-install-recommends curl bash golang alsa-utils alsa-tools \
    libasound2 jq sudo libogg-dev libvorbis-dev libasound2-dev \
    nano mpv socat > /dev/null
 apt clean -y > /dev/null
 rm -rf /var/cache/apt/archives /var/lib/apt/lists
 useradd --system appuser
 passwd -d appuser
 usermod -aG sudo appuser
 usermod -aG audio appuser
 usermod -aG audio root

 echo "%sudo      ALL=(ALL:ALL) NOPASSWD: ALL" >>/etc/sudoers
 echo "appuser    ALL=(ALL:ALL) NOPASSWD: ALL" >>/etc/sudoers

 mkdir -p /app/config /root/pipewire /run/dbus /root/pulse /app/socket
EOF

WORKDIR /app

RUN <<EOF
 cd /app
 DOWNLOAD_URL=$(curl -s https://api.github.com/repos/devgianlu/go-librespot/releases/latest \
  | jq '.assets[].browser_download_url' -r | grep go-librespot_linux_$TARGETARCH.tar.gz)
 curl -k --insecure -L "$DOWNLOAD_URL" -o ./librespot.tar.gz
 tar xvf ./librespot.tar.gz go-librespot
 chmod +x go-libre~spot
 rm ./librespot.tar.gz
EOF

COPY ./config.yml /app/default.config
COPY ./start.sh ./
COPY ./mplayer.sh ./
RUN chmod +x ./*.sh

ENV DBUS=/run/dbus
ENV PULSE_RUNTIME_PATH=/root/pulse
ENV USERPROFILE=/root/pipewire
ENV USEPIPEWIRE=no

VOLUME /app/config

EXPOSE 3678

ENTRYPOINT [ "/bin/bash", "-E", "-c" ]

CMD [ "/app/start.sh" ]
 
