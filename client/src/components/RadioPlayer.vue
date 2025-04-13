<script lang="ts">
import { SpotifyService } from '../services/spotify.service';
import { TunerService } from '../services/tuner.service';
import { JackService } from '../services/jack.service';
import { on, emit, off } from '../composables/useeventbus';
import { usePlayerStore } from '@/stores/player';

export default {
  name: 'RadioPlayer',
  data() {
    return {
      hasData: false,
      paused: false,
      stopped: false,
      volume: 100,
      station: {} as any,
    };
  },
  mounted() {
    const tunerService = new TunerService();
    const playerStore = usePlayerStore();
    this.paused = false;
    this.stopped = true;
    this.station = {};

    tunerService.getStatus().then((state) => {
      this.volume = state.volume;
    });

    if (playerStore.getSource() == 'streamer') {
      this.getPlayerState();
    }

    on('eject', (data: any) => {
      this.hasData = false;
      this.stopped = true;
      this.station = {};
    });

    on('streamer.stream-changed', (data: any) => {
      this.paused = false;
      this.stopped = false;
      //      this.station = data.station;
    });

    on('audio_changed', (data: any) => {
      if (data.source == 'streamer') {
        const tunerService = new TunerService();
        tunerService.getStation(data.uri).then((station) => {
          this.station = station;
          this.hasData = true;
        });
      }
    });

    on('source_changed', (data: any) => {
      if (data.source == 'streamer') {
        const jackService = new JackService();
        jackService.stopDevice('spotify');
        this.getPlayerState();
      } else {
        const jackService = new JackService();
        jackService.stopDevice('streamer');
        this.paused = false;
        this.stopped = true;
        this.station = {};
        this.hasData = false;
      }
    });
  },
  beforeUnmount() {
    off('eject');
    off('source_changed');
    off('audio_changed');
    off('streamer.stream-changed');
  },
  methods: {
    getPlayerState() {
      const jackService = new JackService();
      jackService.getStatus().then((state) => {
        if (state.playing && state.playing.source == 'streamer') {
          const tunerService = new TunerService();
          tunerService.getStation(state.playing.stationuuid).then((station) => {
            this.station = station;
            this.hasData = true;
          });
        }
      });
    },
    setVolume(value) {
      const tunerService = new TunerService();
      tunerService.setVolume(value);
      this.volume = value;
    },
    playRadio(uuid: string) {
      const tunerService = new TunerService();
      tunerService.playStation(uuid).then((station) => {
        this.station = station;
        this.hasData = true;
      });
    },
    play() {
      const tunerService = new TunerService();
      tunerService.playStation(this.station.stationuuid).then((station) => {
        this.station = station;
        this.hasData = true;
        this.getPlayerState();
        this.stopped = false;
        this.paused = false;
      });
    },
    pause() {
      if (this.paused) {
        this.play();
      } else {
        const tunerService = new TunerService();
        tunerService.stop();
      }
      this.paused = !this.paused;
    },
    stop() {
      const tunerService = new TunerService();
      tunerService.stop();
      this.paused = false;
      this.stopped = true;
    },
    eject() {
      this.paused = false;
      this.stopped = true;
      const jackService = new JackService();
      jackService.eject();
      this.station = null;
      this.hasData = false;
      this.getPlayerState();
      emit('eject', { source: 'stream' });
    },
  },
};
</script>
<template>
  <v-container v-if="hasData">
    <v-row v-if="station.favicon">
      <v-col cols="12">
        <div class="centre">
          <div class="albumimg">
            <img :src="station.favicon" />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="centre">
          <h4>{{ station.name }}</h4>
          <h5>{{ station.codec }}</h5>
          <h6>{{ station.bitrate }}kbps</h6>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-row v-if="hasData">
    <v-col cols="2" />
    <v-col cols="9">
      <table border="0" cellpadding="4" cellspacing="4">
        <tbody>
          <tr>
            <td>
              <v-btn
                v-if="paused"
                color="primary"
                icon="mdi-play"
                size="small"
                @click="play()"
              />
              <v-btn
                v-if="!paused"
                color="primary"
                icon="mdi-pause"
                size="small"
                @click="pause()"
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
                color="primary"
                size="small"
                icon="mdi-eject"
                @click="eject()"
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
        v-model="volume"
        append-icon="mdi-volume-high"
        prepend-icon="mdi-volume-mute"
        track-color="primary"
        step="1"
        min="0"
        max="100"
        @click:append="setVolume(100)"
        @click:prepend="setVolume(0)"
        @end="setVolume"
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
