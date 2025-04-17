## PiStereo

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run docker:restart

# watch mode
 npm run docker:restart && npm run docker:logs

# production mode
$ docker compose -f ./docker-compose.yaml up -d
```

## Run tests

```bash
# unit tests
$ npm run test
```

## Deployment

Bundled as a Docker container available from [https://hub.docker.com/r/guidcruncher/pistereo](https://hub.docker.com/r/guidcruncher/pistereo)

See example Docker compose

```dockerfile
name: pistereo

services:
  pistereo:
    image: guidcruncher/pistereo:latest
    extra_hosts:
      - pistereo:127.0.0.1
    network_mode: host
    expose:
      - 3000
    environment:
      - TZ=Europe/London
      - ALSA_DEVICE=equal
    container_name: pistereo
    hostname: pistereo
    restart: unless-stopped
    volumes:
      - ../config/config:/pistereo/app/config
      - ../config/mediaserver/:/pistereo/mediaserver/config
    devices:
      - /dev/snd:/dev/snd:rw
    privileged: true
```

```bash
$ docker compose -f ./docker-compose.yaml up -d
```

