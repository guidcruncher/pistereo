<template>
  <v-expansion-panels v-model="panel" multiple>
    <v-expansion-panel>
      <v-expansion-panel-title>Presets</v-expansion-panel-title>
      <v-expansion-panel-text>
        <RadioPresets />
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>Most Popular Tracks</v-expansion-panel-title>
      <v-expansion-panel-text>
        <TopTracks />
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>Saved Podcasts</v-expansion-panel-title>
      <v-expansion-panel-text>
        <SavedShows />
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>Saved Albums</v-expansion-panel-title>
      <v-expansion-panel-text>
        <SavedAlbums />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <ShowChooser />
</template>

<script lang="ts">
import { on, emit, off } from '../composables/useeventbus';

export default {
  name: 'LibraryPage',
  data() {
    return {
      panel: [0],
    };
  },
  mounted() {},
  beforeUnmount() {},
  methods: {},
};
</script>
<script lang="ts" setup></script>
