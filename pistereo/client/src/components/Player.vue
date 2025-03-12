<script lang="ts">
import { SpotifyService } from '../services/spotify.service';

export default {
  name: 'player',
  data() {
    return {
    };
  },
  methods: {
    previous() {},
    play() {},
    pause() {},
    stop() {},
    next() {}
  }
};
</script>
<script lang="ts" setup>
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="auto"
        ><v-btn @click="previous()"
          color="primary"
          icon="mdi-skip-previous"
        ></v-btn
      ></v-col>
      <v-col cols="auto"
        ><v-btn @click="play()"
          color="primary"
          icon="mdi-play"
        ></v-btn
      ></v-col>
      <v-col cols="auto"
        ><v-btn @click="pause()"
          color="primary"
          icon="mdi-pause"
        ></v-btn
      ></v-col>
      <v-col cols="auto"
        ><v-btn @click="stop()"
          color="primary"
          icon="mdi-stop"
        ></v-btn
      ></v-col>
      <v-col cols="auto"
        ><v-btn @click="next()"
          color="primary"
          icon="mdi-skip-next"
        ></v-btn
      ></v-col>
    </v-row>
  </v-container>
</template>

<style></style>
