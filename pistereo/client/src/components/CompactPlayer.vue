<script lang="ts">
import { usePlayerStore } from '@/stores/player';
import { SpotifyService } from '../services/spotify.service';
import { on, emit, off } from '../composables/useeventbus';
import { JackService } from '../services/jack.service';

export default {
  name: 'CompactPlayer',
  data() {
    return {
      timer: 0,
      hasData: false,
      track: {} as any,
      player: {} as any,
    };
  },
  methods: {
    setVolume(value: number = 100) {
      const spotifyService = new SpotifyService();
      if (value) {
        spotifyService
          .setDeviceVolume(value)
          .then((response) => {
            if (response) {
              this.getPlayerState();
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    getPlayerState() {
      const jackService = new JackService();
      jackService.getStatus().then((state) => {
        if (state.playing && state.playing.source == 'spotify') {
          const spotifyService = new SpotifyService();
          spotifyService
            .getLibrespotState()
            .then((response) => {
              if (response) {
                this.player = response;
                this.player.is_playing = !(response.stopped || response.paused);
                this.player.is_loaded = true;
                this.hasData = true;
                this.setTrack(response.track);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          this.hasData = false;
        }
      });
    },
    setTrack(s: any) {
      if (s) {
        let track = s;
        track.progressPercent = Math.abs(
          (100 / track.duration) * track.position,
        );
        track.artist = track.artist_names.join(', ');
        this.track = track;
      }
    },
    previous() {
      const spotifyService = new SpotifyService();
      spotifyService
        .playerOp(this.player.device_id, 'previous')
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
        .playerOp(this.player.device_id, 'play')
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
        .playerOp(this.player.device_id, 'pause')
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
        .playerOp(this.player.device_id, 'stop')
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
        .playerOp(this.player.device_id, 'next')
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
    const playerStore = usePlayerStore();
    this.hasData = false;

    this.track = { progressPercent: 0 };
    this.player = { is_loaded: false, is_playing: false };

    this.getPlayerState();

    on('source_changed', (data: any) => {
      if (data.source == 'spotify') {
        const jackService = new JackService();
        jackService.stopDevice('streamer');
        this.getPlayerState();
        if (this.timer == 0) {
          this.timer = setInterval(() => {
            this.getPlayerState();
          }, 10000);
        }
      }
    });

    on('streamer.file-loaded', (data: any) => {
      const jackService = new JackService();
      jackService.stopDevice('spotify');
      const spotifyService = new SpotifyService();
      // spotifyService.playerOp(this.player.device_id, 'stop').then(() => {
      clearInterval(this.timer);
      this.timer = 0;
    });

    on('spotify.metadata', (data: any) => {
      this.getPlayerState();
    });

    on('spotify.volume', (data: any) => {
      this.player.volume = data.value;
    });

    on('spotify.playing', (data: any) => {
      const jackService = new JackService();
      jackService.stopDevice('streamer');
      if (this.timer == 0) {
        this.timer = setInterval(() => {
          this.getPlayerState();
        }, 10000);
      }
      this.getPlayerState();
    });

    on('spotify.paused', (data: any) => {
      this.getPlayerState();
      clearInterval(this.timer);
      this.timer = 0;
    });

    on('spotify.seek', (data: any) => {
      this.getPlayerState();
    });

    on('spotify.stopped', (data: any) => {
      this.getPlayerState();
      clearInterval(this.timer);
      this.timer = 0;
    });

    this.timer = setInterval(() => {
      this.getPlayerState();
    }, 10000);
  },
  beforeDestroy() {
    off('source_changed');
    off('spotify.metadata');
    off('spotify.volume');
    off('spotify.playing');
    off('spotify.paused');
    off('spotify.seek');
    off('spotify.stopped');
    off('streamer.file-loaded');
    clearInterval(this.timer);
  },
};
</script>
<template>
  <v-container v-if="hasData">
    <v-row v-if="hasData">
      <v-col cols="12">
        <div class="centre">
          <div class="albumimg">
            <img :src="track.album_cover_url" />
          </div>
        </div> </v-col
    ></v-row>
    <v-row v-if="hasData">
      <v-col cols="12"
        ><div class="centre">
          <h4>{{ track.album_name }}</h4>
          <h5>{{ track.name }}</h5>
          <h6>{{ track.artist }}</h6>
        </div>
      </v-col></v-row
    >
    <v-row>
      <v-col cols="3">
        <v-btn
          @click="previous()"
          color="primary"
          size="small"
          icon="mdi-skip-previous"
        ></v-btn
      ></v-col>
      <v-col cols="3">
        <v-btn
          @click="play()"
          color="primary"
          icon="mdi-play"
          size="small"
          v-if="!player.is_playing"
        ></v-btn>
        <v-btn
          @click="pause()"
          color="primary"
          icon="mdi-pause"
          size="small"
          v-if="player.is_playing"
        ></v-btn>
      </v-col>
      <v-col cols="3"
        ><v-btn
          @click="stop()"
          size="small"
          color="primary"
          icon="mdi-stop"
        ></v-btn
      ></v-col>
      <v-col cols="3"
        ><v-btn
          @click="next()"
          color="primary"
          size="small"
          icon="mdi-skip-next"
        ></v-btn
      ></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" v-if="hasData">
        <v-slider
          v-model="track.progressPercent"
          track-color="green"
          step="1"
          min="0"
          max="100"
          readonly
        ></v-slider> </v-col
    ></v-row>
    <v-row v-if="player.volume">
      <v-col cols="12"
        ><v-slider
          v-model="player.volume"
          append-icon="mdi-volume-high"
          prepend-icon="mdi-volume-mute"
          @click:append="setVolume(100)"
          @click:prepend="setVolume(0)"
          track-color="primary"
          step="1"
          min="0"
          max="100"
          @end="setVolume"
        ></v-slider> </v-col
    ></v-row>
  </v-container>
</template>

<style>
.table {
  display: table;
}
.table div {
  display: table-cell;
  vertical-align: middle;
}
.table .space {
  display: table-cell;
  width: 10px;
}
.albumimg {
  margin: 0 auto;
  width: 150px;
  height: 150px;
  border-radius: 15%;
  overflow: hidden;
}
.albumimg img {
  max-width: 100%;
  max-height: 100%;
}
.centre {
  text-align: center;
  margin: 0 auto;
}
</style>
