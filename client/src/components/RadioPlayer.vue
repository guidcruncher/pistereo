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
      station: {} as any,
    };
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
    },
  },
  mounted() {
    const playerStore = usePlayerStore();
    this.paused = false;
    this.stopped = true;
    this.station = {};

    if (playerStore.getSource() == 'streamer') {
      this.getPlayerState();
    }

    on('source_changed', (data: any) => {
      if (data.source == 'streamer') {
        const jackService = new JackService();
        jackService.stopDevice('spotify');
        this.getPlayerState();
      }
    });
  },
  beforeDestroy() {
    off('source_changed');
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
        </div> </v-col
    ></v-row>
    <v-row>
      <v-col cols="12"
        ><div class="centre">
          <h4>{{ station.name }}</h4>
          <h5>{{ station.codec }}</h5>
          <h6>{{ station.bitrate }}kbps</h6>
        </div>
      </v-col></v-row
    >
    <v-row>
      <v-col cols="2" />
      <v-col cols="3">
        <v-btn
          @click="play()"
          color="primary"
          icon="mdi-play"
          size="small"
          v-if="paused"
        ></v-btn>
        <v-btn
          @click="pause()"
          color="primary"
          icon="mdi-pause"
          size="small"
          v-if="!paused"
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
          @click="eject()"
          color="primary"
          size="small"
          icon="mdi-eject"
        ></v-btn
      ></v-col>
      <v-col cols="1" />
    </v-row>
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
