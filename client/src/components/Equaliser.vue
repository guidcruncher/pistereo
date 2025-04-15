<script lang="ts" setup></script>
<script lang="ts">
import { on, emit, off } from '../composables/useeventbus';
import { JackService } from '../services/jack.service';
import { usePlayerStore } from '@/stores/player';

export default {
  name: 'Equaliser',
  data() {
    return {
      presets: [] as any[],
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
    getPresets() {
      const jackService = new JackService();
      const playerStore = usePlayerStore();

      jackService
        .getEqualiserPresets(playerStore.getSource())
        .then((presets: any[]) => {
          this.presets = presets;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    setEqualiser(value) {
      const jackService = new JackService();
      jackService
        .setEqualiser(value.num, value.left, value.left)
        .then(() => {
          this.getLevels();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    resetEqualiser() {
      const jackService = new JackService();
      jackService
        .resetEqualiser(50)
        .then(() => {
          this.getLevels();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
<template>
  <v-card if="hasData">
    <v-row>
      <v-col v-for="item in levels" :key="item" :value="item">
        <v-slider
          v-model="item.left"
          direction="vertical"
          min="0"
          max="100"
          step="1"
          density="compact"
          @end="setEqualiser(item)"
        >
        </v-slider>
        <div class="text-caption">{{ item.shortname }}</div>
      </v-col>
    </v-row>
    <v-card-actions>
      <v-btn text="Reset" @click="resetEqualiser()"></v-btn>

      <v-select label="Presets" :items="presets"></v-select>

      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>
