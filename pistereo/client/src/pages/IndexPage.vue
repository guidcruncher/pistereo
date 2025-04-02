<template>
  <NowPlaying v-if="source == 'spotify'" />
  <NowPlayingRadio v-if="source == 'streamer'" />
</template>

<script lang="ts">
import { usePlayerStore } from '@/stores/player';
import { on, emit, off } from '../composables/useeventbus';
import { JackService } from '../services/jack.service';

export default {
  name: 'CompactPlayer',
  data() {
    return {
      source: '',
    };
  },
  methods: {},
  mounted() {
    const playerStore = usePlayerStore();
    this.source = playerStore.getSource();

    const jackService = new JackService();
    jackService.getStatus().then((currentSource) => {
      if (currentSource && currentSource.playing) {
        this.source = currentSource.playing.source;
      }
    });

    on('source_changed', (data: any) => {
      this.source = data.source;
    });
  },
  beforeDestroy() {
    off('source_changed');
  },
};
</script>
<script lang="ts" setup></script>
