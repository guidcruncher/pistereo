<script lang="ts">
import { SpotifyService } from '../services/spotify.service';
import { TunerService } from '../services/tuner.service';
import { JackService } from '../services/jack.service';
import { on, emit, off } from '../composables/useeventbus';
import { usePlayerStore } from '@/stores/player';
import formatDateMixin from '../mixins/formatDateMixin';

export default {
  name: 'NowPlayingRadio',
  mixins: [formatDateMixin],
  data() {
    return {
      hasData: false,
      hasEpg: false,
      source: {} as any,
      station: {} as any,
      nowplaying: {} as any,
      timer: 0,
      epg: [] as any[],
    };
  },
  mounted() {
    const playerStore = usePlayerStore();
    this.hasData = false;
    this.station = {};
    this.nowplaying = {};
    this.epg = [];
    this.hasEpg = false;
    this.tick();
    this.timer = setInterval(() => {
      this.tick();
    }, 5000);

    if (playerStore.getSource() == 'streamer') {
      this.getPlayerState();
    }

    on('streamer.stream-changed', (data: any) => {
      this.hasData = false;
      this.hasEpg = false;
      this.getPlayerState();
    });

    on('source_changed', (data: any) => {
      if (data.source == 'streamer') {
        const jackService = new JackService();
        jackService.stopDevice('spotify');
        this.hasData = false;
        this.hasEpg = false;
        this.getPlayerState();
      } else {
        const jackService = new JackService();
        jackService.stopDevice('streamer');
        this.hasData = false;
        this.hasEpg = false;
      }
    });
  },
  beforeUnmount() {
    clearInterval(this.timer);
    this.timer = 0;
    off('source_changed');
    off('streamer.stream-changed');
  },
  methods: {
    tick() {
      const jackService = new JackService();
      jackService.getStreamerStatus().then((state) => {
        this.nowplaying = state;
      });
    },
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
};
</script>
<template>
  <v-container v-if="hasData">
    <v-container v-if="hasData">
      <v-row v-if="station.image">
        <v-col cols="12">
          <div class="centre">
            <div class="albumimgbig">
              <img :src="station.image" />
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="centre">
            <h2>{{ station.name }}</h2>
            <h3>{{ station.description }}</h3>
            <h5 v-if="nowplaying && nowplaying.metadata">
              Now playing - {{ nowplaying.metadata['icy-title'] }} ({{
                nowplaying.metadata['icy-genre']
              }})
            </h5>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-card v-if="hasEpg">
      <v-card-title sticky> Program Guide </v-card-title>
      <v-list nav>
        <v-list-item v-for="item in epg" :key="item" :value="item">
          <v-list-item-title v-text="item.title" />
          <v-list-item-subtitle v-text="item.desc" />
          <template #append>
            <table
              v-if="!item.sameDay"
              class="v-list-item-subtitle"
              border="0"
              cellpadding="2"
              cellspacing="2"
            >
              <tbody>
                <tr>
                  <td>
                    <div>
                      {{ formatTinyDate(item.start) }}<br />
                      {{ formatTime(item.start) }}
                    </div>
                  </td>
                  <td>
                    <div>
                      {{ formatTinyDate(item.stop) }}<br />
                      {{ formatTime(item.stop) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              v-if="item.sameDay"
              class="v-list-item-subtitle"
              border="0"
              cellpadding="2"
              cellspacing="2"
            >
              <tbody>
                <tr>
                  <td class="text-center" colspan="2">
                    <div>{{ formatTinyDate(item.start) }}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>{{ formatTime(item.start) }}</div>
                  </td>
                  <td>
                    <div>
                      {{ formatTime(item.stop) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
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
