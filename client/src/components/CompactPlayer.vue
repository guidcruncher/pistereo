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
  mounted() {
    const playerStore = usePlayerStore();
    this.hasData = false;

    this.track = { progressPercent: 0 };
    this.player = { is_loaded: false, is_playing: false };

    this.getPlayerState();

    on('source_changed', (data: any) => {
      if (data.playing) {
        if (data.playing.source == 'spotify') {
          const jackService = new JackService();
          jackService.stopDevice('streamer');
          this.hasData = true;
          this.getPlayerState();
          if (this.timer == 0) {
            this.timer = setInterval(() => {
              this.getPlayerState();
            }, 10000);
          }
        } else {
          clearInterval(this.timer);
          this.timer = 0;
          this.hasData = false;
        }
      } else {
        this.hasData = false;
        clearInterval(this.timer);
        this.timer = 0;
        this.timer = setInterval(() => {
          this.getPlayerState();
        }, 10000);
      }
    });

    on('eject', (data: any) => {
      this.hasData = false;
      clearInterval(this.timer);
      this.timer = 0;
    });

    on('streamer.file-loaded', (data: any) => {
      const jackService = new JackService();
      jackService.stopDevice('spotify');
      const spotifyService = new SpotifyService();
      // spotifyService.playerOp(this.player.device_id, 'stop').then(() => {
      clearInterval(this.timer);
      this.timer = 0;
      this.hasData = false;
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
  },
  beforeUnmount() {
    off('eject');
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
  methods: {
    setVolumeFromModel() {
      this.setVolume(this.player.volume);
    },
    setVolume(volume: number) {
      const spotifyService = new SpotifyService();
      spotifyService
        .setDeviceVolume(volume)
        .then((response) => {
          if (response) {
            this.getPlayerState();
          }
        })
        .catch((e) => {
          console.log(e);
        });
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
        const track = s;
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
          this.player.is_playing = false;
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
        .then((state) => {})
        .catch((e) => {
          console.log(e);
        });
    },
    eject() {
      this.player.is_playing = false;
      const jackService = new JackService();
      jackService.eject();
      this.hasData = false;
      this.track = {};
      this.player = {};
      this.getPlayerState();
      emit('eject', { source: 'spotify' });
    },
  },
};
</script>
<template>
  <v-container v-if="hasData">
    <v-row>
      <v-col cols="12">
        <div class="centre">
          <div class="albumimg">
            <img :src="track.album_cover_url">
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="centre">
          <h4>{{ track.album_nameħeszŵ }}</h4>
          <h5>{{ track.name }}</h5>
          <h6>{{ track.artist }}</h6>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-row v-if="hasData">
    <v-col cols="12">
      <table
        border="0"
        cellpadding="4"
        cellspacing="4"
      >
        <tbody>
          <tr>
            <td>
              <v-btn
                color="primary"
                size="small"
                icon="mdi-skip-previous"
                @click="previous()"
              />
            </td>
            <td>
              <v-btn
                size="small"
                color="primary"
                icon="mdi-stop"
                @click="stop()"
              />
            </td>
            <td>
              <v-btn
                v-if="!player.is_playing"
                color="primary"
                size="small"
                icon="mdi-play"
                @click="play()"
              />
              <v-btn
                v-if="player.is_playing"
                color="primary"
                size="small"
                icon="mdi-pause"
                @click="pause()"
              />
            </td>
            <td>
              <v-btn
                color="primary"
                size="small"
                icon="mdi-eject"
                @click="eject()"
              />
            </td>
            <td>
              <v-btn
                color="primary"
                size="small"
                icon="mdi-skip-next"
                @click="next()"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </v-col>
  </v-row>
  <v-row v-if="hasData">
    <v-col cols="12">
      <v-slider
        v-model="track.progressPercent"
        track-color="green"
        step="1"
        min="0"
        max="100"
        readonly
      />
    </v-col>
  </v-row>
  <v-row v-if="hasData">
    <v-col cols="12">
      <v-slider
        v-model="player.volume"
        append-icon="mdi-volume-high"
        prepend-icon="mdi-volume-mute"
        track-color="primary"
        step="1"
        min="0"
        max="100"
        @click:append="setVolume(100)"
        @click:prepend="setVolume(0)"
        @end="setVolumeFromModel()"
      />
    </v-col>
  </v-row>
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
