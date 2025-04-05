<script lang="ts">
import { SpotifyService } from '../services/spotify.service';
import { TunerService } from '../services/tuner.service';
import { JackService } from '../services/jack.service';
import { on, emit, off } from '../composables/useeventbus';
import { usePlayerStore } from '@/stores/player';

export default {
  name: 'NowPlayingRadio',
  data() {
    return {
      hasData: false,
      hasEpg: false,
      source: {} as any,
      station: {} as any,
      epg: [] as any[],
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
          this.hasEpg = false;
          tunerService.getEpg(state.playing.stationuuid).then((epg) => {
            this.epg = epg;
            this.hasEpg = true;
          });
        }
      });
    },
  },
  mounted() {
    const playerStore = usePlayerStore();
    this.hasData = false;
    this.station = {};
    this.epg = [];
    this.hasEpg = false;

    if (playerStore.getSource() == 'streamer') {
      this.getPlayerState();
    }

    on('source_changed', (data: any) => {
      if (data.source == 'streamer') {
        this.getPlayerState();
      }
    });
  },
  beforeUnmount() {},
  beforeDestroy() {
    off('source_changed');
  },
};
</script>
<template>
  <v-container v-if="hasData">
    <v-container v-if="hasData">
      <v-row v-if="station.favicon">
        <v-col cols="12">
          <div class="centre">
            <div class="albumimgbig">
              <img :src="station.favicon" />
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="centre">
            <h2>{{ station.name }}</h2>
            <h3>{{ station.codec }}, {{ station.bitrate }}kbps</h3>
            <h4>
              <a :href="station.homepage">{{ station.homepage }}</a>
            </h4>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-card v-if="hasEpg">
      <v-list lines="false" nav>
        <v-list-item v-for="item in epg" :key="item" :value="item">
          <v-list-item-title v-text="item.title" />
          <v-list-item-subtitle v-text="item.desc" />
          <v-list-item-subtitle v-text="item.start" /> -
          <v-list-item-subtitle v-text="item.stop" />
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<style>
.albumimgbig {
  margin: 0 auto;
  width: 200px;
  height: 200px;
  border-radius: 15%;
  overflow: hidden;
}
.albumimgbig img {
  max-width: 100%;
  max-height: 100%;
}
.centre {
  text-align: center;
  margin: 0 auto;
}
</style>
