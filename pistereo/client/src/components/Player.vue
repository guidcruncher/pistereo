<script lang="ts">
import { SpotifyService } from '../services/spotify.service';
// import VueSSE from 'vue-sse';

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
    initialise() {
      const evtSource = new EventSource('/webhook/sse');
      evtSource.onmessage = (e) => {
        let ev = JSON.parse(e.data);
        switch (ev.name) {
          case 'playing':
          case 'paused':
          case 'session_connected':
          case 'stopped':
          case 'track_changed':
            this.getPlayerState();
            break;
          case 'volume_changed':
            this.getPlayerDevice();
            break;
        }
      };
    },
  },
  mounted() {
    this.hasData = false;
    this.device = {} as DeviceObject;
    this.player = {};
    this.getPlayerDevice();
    this.getPlayerState();
    this.initialise();
  },
};
</script>

<template>
  <v-container v-if="hasData">
    <v-card v-if="hasData">
      <v-card-item>
        <v-container v-if="track.is_playing">
          <div class="table">
            <div>
              <div class="albumimg">
                <img :src="track.album.image.url" />
              </div>
            </div>
            <div class="space"></div>
            <div>
              <h3>{{ track.album.name }}</h3>
              <h5>{{ track.track.name }}</h5>
            </div>
          </div>
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
              ><v-btn
                @click="next()"
                color="primary"
                icon="mdi-skip-next"
              ></v-btn
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
      </v-card-item>
    </v-card>
  </v-container>
</template>

<style>
.table {
  display: table;
}
.table div {
  display: table-cell;
  vertical-align:middle;
}
.table .space {
  display: table-cell;
  width: 10px;
}
.albumimg {
  width: 150px;
  height: 150px;
  border-radius: 15%;
  overflow: hidden;
}
.albumimg img {
  max-width: 100%;
  max-height: 100%;
}
</style>
