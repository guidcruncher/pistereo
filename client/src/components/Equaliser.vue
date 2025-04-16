<script lang="ts" setup></script>
<script lang="ts">
import { on, emit, off } from '../composables/useeventbus';
import { JackService } from '../services/jack.service';
import { usePlayerStore } from '@/stores/player';

export default {
  name: 'Equaliser',
  data() {
    return {
      preset: '',
      presets: [] as any[],
      levels: [] as any[],
      hasData: false,
    };
  },
  mounted() {
    this.hasData = false;
    this.getLevels();
    this.getPresets();

    on('source_changed', (data: any) => {
      this.preset = '';
      this.getPresets();
    });
  },
  beforeUnmount() {
    off('source_changed');
  },
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
      let src = playerStore.getSource();
      if (!src || src === '') {
        src = 'spotify';
      }
      jackService
        .getEqualiserPresets(src)
        .then((presets: any[]) => {
          this.presets = presets;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    loadPreset() {
      const jackService = new JackService();
      let ctrl = this.presets.find((p) => {
        return p.name == this.preset;
      });
      if (ctrl) {
        let p: Promise[] = [];
        for (var i = 0; i < ctrl.values.length; i++) {
          if (ctrl.values[i].left && ctrl.values[i].right) {
            p.push(
              jackService.setEqualiser(
                i,
                ctrl.values[i].left,
                ctrl.values[i].right,
              ),
            );
          } else {
            p.push(jackService.setEqualiser(i, ctrl.values[i], ctrl.values[i]));
          }
        }

        Promise.allSettled(p)
          .then((res) => {
            this.getLevels();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    setEqualiser(value) {
      const jackService = new JackService();
      jackService
        .setEqualiser(value.num, value.left, value.left)
        .then(() => {
          this.getLevels();
          this.preset = '';
        })
        .catch((e) => {
          console.log(e);
        });
    },
    resetEqualiser() {
      const jackService = new JackService();
      jackService
        .resetEqualiser(60)
        .then(() => {
          this.preset = '';
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
      <v-select
        label="Presets"
        v-model="preset"
        item-title="name"
        item-value="name"
        :items="presets"
        @update:modelValue="loadPreset()"
      ></v-select>

      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>
