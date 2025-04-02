<script lang="ts">
import { TunerService } from '../services/tuner.service';

export default {
  name: 'RadioPresets',
  data() {
    return {
      presets: any[],
      hasData: false,
    };
  },
  mounted() {
    this.hasData = false;
    this.presets=[];
    this.getRadioPresets();
  },
  methods: {
    getRadioPresets() {
      const tunerService = new TunerService();
      tunerService
        .getPresets()
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
<script lang="ts" setup>
</script>

<template>
<v-card title="Presets">
<v-infinite-scroll
    direction="horizontal"
    @load="getRadioPresets"
  >
    <template v-for="(item, index) in presets" :key="item">
<div class="albumimgbig">
              <img :src="item.image" />
            </div>
    </template>
  </v-infinite-scroll>
</v-card>
</template>
 <style>
</style>
