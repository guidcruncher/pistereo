<template>
  <NowPlaying v-if="source == 'spotify'" />
  <NowPlayingRadio v-if="source == 'streamer'" />
</template>

<script lang="ts">
import { usePlayerStore } from '@/stores/player';
import { on, emit, off } from '../composables/useeventbus';
import { JackService } from '../services/jack.service';

export default {
  name: 'NowPlayingPage',
  data() {
    return {
      source: '',
    };
  },
  mounted() {
    const playerStore = usePlayerStore();
    this.source = playerStore.getSource();
    const jackService = new JackService();
    jackService.getStatus().then((currentSource) => {
      if (currentSource && currentSource.playing) {
        this.source = currentSource.playing.source;
      }
    });

    on('audio_changed', (data: any) => {
      this.source = data.source;
    });

    on('eject', (data: any) => {
      this.source = '';
    });

    on('streamer.file-loaded', (data: any) => {
      this.source = 'streamer';
    });

    on('spotify.metadata', (data: any) => {
      this.source = 'spotify';
    });

    on('streamer.stream-changed', (data: any) => {
      this.source = 'streamer';
    });
    on('source_changed', (data: any) => {
      this.source = data.source;
    });
  },
  beforeUnmount() {
    off('eject');
    off('spotify.metadata');
    off('streamer.file-loaded');
    off('streamer.stream-changed');
    off('source_changed');
    off('audio_changed');
  },
  methods: {},
};
</script>
<script lang="ts" setup></script>
