<script lang="ts" setup></script>
<script lang="ts">
import { on, emit, off } from '../composables/useeventbus';
import { JackService } from '../services/jack.service';

export default {
  name: 'Equaliser',
  data() {
    return {
      levels: [] as any[],
      hasData: false,
    };
  },
  mounted() {
    this.hasData = false;
    this.getLevels();
  },
  beforeUnmount() {},
  methods: {
    getLevels() {
      const jackService = new JackService();
      jackService
        .getEqualiser()
        .then((levels) => {
          this.levels = levels;
          this.hasData = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    setEqualiser(value) {
      const jackService = new JackService();
      jackService.setEqualiser(value.index, value.left, value.left);
    },
  },
};
</script>
<template>
  <v-row v-if="hasData">
    <v-col v-for="item in levels" :key="item" :value="item">
      <v-slider
        v-model="item.left"
        direction="vertical"
        min="0"
        max="100"
        step="1"
        @end="setEqualiser(item)"
      ></v-slider>
    </v-col>
  </v-row>
</template>
