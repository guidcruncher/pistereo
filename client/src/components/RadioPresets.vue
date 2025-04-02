<script>
import { TunerService } from '../services/tuner.service';
import { on, emit, off } from '../composables/useeventbus';
import { ref } from 'vue';

export default {
  name: 'Radiopresets',
  data() {
    return {
      presets: null,
      hasData: false,
    };
  },
  mounted() {
    this.hasData = false;
    this.tracks = null;
  },
  beforeUnmount() {},
  methods: {
    playRadio(item) {
      const tunerService = new TunerService();
      tunerService.playStation(item.stationuuid);
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
  <v-card title="Presets">
    <template v-for="(item, index) in presets" :key="item">
      <div class="stationlogo" @click="playRadio(item)">
        <img :src="item.image" />
      </div>
      {{ item.name }}
      <a :href="item.info.homepage">{{ item.info.homepage }}</a>
    </template>
  </v-card>
</template>

<style>
.stationlogo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}
.profileimg img {
  max-width: 100%;
  max-height: 100%;
}
</style>
