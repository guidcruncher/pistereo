<script lang="ts">
import { SpotifyService } from '../services/spotify.service';

export default {
  name: 'player',
  data() {
    return {
      device: {} as DeviceObject,
      hasData: false,
      track: {} as any,
      player: {} as any,
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
    setVolume() {
      const spotifyService = new SpotifyService();
      spotifyService
        .setDeviceVolume(this.device.id, this.device.volume_percent)
        .then((response) => {
          if (response) {
            this.getPlayerDevice();
            this.getPlayerState();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getPlayerState() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getPlayerState()
        .then((response) => {
          if (response) {
            this.player = response;
            this.hasData = true;
            this.setTrack(response);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    setTrack(s: any) {
      let track = { is_playing: false } as any;
      if (s) {
        track = {
          is_playing: s.is_playing,
          album: {
            image: s.item.album.images[0],
            name: s.item.album.name,
            id: s.item.album.id,
            uri: s.item.album.uri,
            artist: s.item.album.artists
              .map((a) => {
                return a.name;
              })
              .join(', '),
          },
          track: {
            name: s.item.name,
            number: s.item.track_number,
            id: s.item.id,
            uri: s.item.uri,
          },
        };
      }
      this.track = track;
    },
    previous() {
      const spotifyService = new SpotifyService();
      spotifyService
        .playerOp(this.device.id, 'previous')
        .then((state) => {
          this.player = state;
          this.setTrack(state);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    play() {
      const spotifyService = new SpotifyService();
      spotifyService
        .playerOp(this.device.id, 'play')
        .then((state) => {
          this.player = state;
          this.setTrack(state);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    pause() {
      const spotifyService = new SpotifyService();
      spotifyService
        .playerOp(this.device.id, 'pause')
        .then((state) => {
          this.player = state;
          this.setTrack(state);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    stop() {
      const spotifyService = new SpotifyService();
      spotifyService
        .playerOp(this.device.id, 'stop')
        .then((state) => {
          this.player = state;
          this.setTrack(state);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    next() {
      const spotifyService = new SpotifyService();
      spotifyService
        .playerOp(this.device.id, 'next')
        .then((state) => {
          this.player = state;
          this.setTrack(state);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.hasData = false;
    this.device = {} as DeviceObject;
    this.player = {};
    this.getPlayerDevice();
    this.getPlayerState();
  },
};
</script>
<script lang="ts" setup>
import { useEventSource } from '@vueuse/core';
import { ref, watch } from 'vue';

const sse = ref(
  useEventSource('/webhook/sse', [], {
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        alert('Failed to connect EventSource after 3 retries');
      },
    },
  }),
);

watch(sse, (newEv, oldEv) => {
  console.log(newEv);
});
</script>

<template>
  <v-container v-if="hasData">
    <v-container v-if="track.is_playing">
      <img
        :src="track.album.image.url"
        :width="track.album.image.width"
        :height="track.album.image.height"
      />
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="auto"
          ><v-btn
            @click="previous()"
            color="primary"
            icon="mdi-skip-previous"
          ></v-btn
        ></v-col>
        <v-col cols="auto" v-if="!track.is_playing"
          ><v-btn @click="play()" color="primary" icon="mdi-play"></v-btn
        ></v-col>
        <v-col cols="auto" v-if="track.is_playing"
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
    <v-container v-if="device.supports_volume">
      <v-slider
        v-model="device.volume_percent"
        label="Volume"
        track-color="green"
        step="1"
        min="0"
        max="100"
        @end="setVolume"
      ></v-slider>
    </v-container>
  </v-container>
</template>

<style></style>
