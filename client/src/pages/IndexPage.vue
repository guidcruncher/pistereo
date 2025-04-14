<template>
  <Clock />

  <v-expansion-panels v-model="panel" multiple>
    <v-expansion-panel>
      <v-expansion-panel-title><v-icon icon="mdi-radio" />&nbsp; Presets</v-expansion-panel-title>
      <v-expansion-panel-text>
        <RadioPresets />
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title><v-icon icon="mdi-album" />&nbsp; Saved Albums</v-expansion-panel-title>
      <v-expansion-panel-text>
        <SavedAlbums />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { on, emit, off } from '../composables/useeventbus';

export default {
  name: 'IndexPage',
  data() {
    return {
      panel: [0],
      source: '',
    };
  },
  mounted() {},
  beforeUnmount() {},
  methods: {},
};
</script>
<script lang="ts" setup></script>
