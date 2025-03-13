<script lang="ts">
import { SpotifyService } from '../services/spotify.service';

export default {
  name: 'player',
  data() {
    return {
      device: {} as DeviceObject,
      hasData: false,
    };
  },
  methods: {
    getPlayerDevice() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getDevice()
        .then((response) => {
          if (response) {
            this.device = response;
            this.hasData = true;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    previous() {
      const spotifyService = new SpotifyService();
      spotifyService
        .playerOp(this.device.id, 'previous')
        .then((state) => {})
        .catch((e) => {
          console.log(e);
        });
    },
    play() {
      const spotifyService = new SpotifyService();
      spotifyService
        .playerOp(this.device.id, 'play')
        .then((state) => {})
        .catch((e) => {
          console.log(e);
        });
    },
    pause() {
      const spotifyService = new SpotifyService();
      spotifyService
        .playerOp(this.device.id, 'pause')
        .then((state) => {})
        .catch((e) => {
          console.log(e);
        });
    },
    stop() {
      const spotifyService = new SpotifyService();
      spotifyService
        .playerOp(this.device.id, 'stop')
        .then((state) => {})
        .catch((e) => {
          console.log(e);
        });
    },
    next() {
      const spotifyService = new SpotifyService();
      spotifyService
        .playerOp(this.device.id, 'next')
        .then((state) => {})
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.hasData = false;
    this.device = {} as DeviceObject;
    this.getPlayerDevice();
  },
};
</script>
<script lang="ts" setup></script>

<template>
  <v-container v-if="hasData">
    {{ device }}
    <v-container>
      <v-row>
        <v-col cols="auto"
          ><v-btn
            @click="previous()"
            color="primary"
            icon="mdi-skip-previous"
          ></v-btn
        ></v-col>
        <v-col cols="auto"
          ><v-btn @click="play()" color="primary" icon="mdi-play"></v-btn
        ></v-col>
        <v-col cols="auto"
          ><v-btn @click="pause()" color="primary" icon="mdi-pause"></v-btn
        ></v-col>
        <v-col cols="auto"
          ><v-btn @click="stop()" color="primary" icon="mdi-stop"></v-btn
        ></v-col>
        <v-col cols="auto"
          ><v-btn @click="next()" color="primary" icon="mdi-skip-next"></v-btn
        ></v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style></style>
