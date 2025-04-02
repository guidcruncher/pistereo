<script>
import { TunerService } from '../services/tuner.service';
import { on, emit, off } from '../composables/useeventbus';

export default {
  name: 'RadioPresets',
  data() {
    return {
      presets: null,
      hasData: false,
    };
  },
  mounted() {
    this.hasData = false;
    this.presets = null;
    this.getRadioPresets();
  },
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
<script lang="ts" setup></script>

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
