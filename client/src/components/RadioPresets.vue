<script lang="ts">
import { JackService } from '../services/jack.service';
import { TunerService } from '../services/tuner.service';
import { on, emit, off } from '../composables/useeventbus';
import { ref } from 'vue';

export default {
  name: 'Radiopresets',
  data() {
    return {
      presets: [] as any[],
      hasData: false,
    };
  },
  mounted() {
    this.hasData = false;
    this.getRadioPresets();
  },
  beforeUnmount() {},
  methods: {
    playRadio(item) {
      const jackService = new JackService();
      jackService.eject();
      const tunerService = new TunerService();
      tunerService.playStation(item.stationuuid);
      emit('streamer.stream-changed', {
        stationuuid: item.stationuuid,
        station: item,
      });
      emit('source_changed', { source: 'streamer' });
    },
    getRadioPresets() {
      const tunerService = new TunerService();
      tunerService
        .getStationPresets()
        .then((response) => {
          this.presets = response;
          this.hasData = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<template>
  <v-card>
    <v-slide-group show-arrows>
      <v-slide-group-item
        v-for="(item, index) in presets"
        :key="item"
        v-slot="{ isSelected, toggle }"
      >
        <div class="spacer">
          <div
            class="stationlogo"
            @click="playRadio(item)"
          >
            <img
              :src="item.image"
              :alt="item.name"
              @click="playRadio(item)"
            >
          </div>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-card>
</template>

<style>
.spacer {
  padding: 5px;
}
.stationlogo {
  width: 80px !important;
  height: 80px !important;
  overflow: hidden;
}
.stationlogo img {
  max-width: 100%;
  max-height: 100%;
}
</style>
