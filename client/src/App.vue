<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { useThemeStore } from '@/stores/theme';
import { usePlayerStore } from '@/stores/player';
import { useAuthStore } from '@/stores/auth';

import { on, emit, off } from './composables/useeventbus';
import { SpotifyService } from './services/spotify.service';
import { JackService } from './services/jack.service';

export default {
  name: 'App',
  data() {
    return {};
  },
  mounted() {
    const themeStore = useThemeStore();
    const playerStore = usePlayerStore();
    const authStore = useAuthStore();

    const token = JSON.parse(
      localStorage.getItem('token') ??
        '{"access_token": "", "refresh_token": ""}',
    ) || { access_token: '', refresh_token: '' };
    if (token.access_token == '') {
      window.location.href = '/api/auth';
      return;
    } else {
      const spotifyService = new SpotifyService();
      const tokenValid = spotifyService.isTokenValid();
      if (!tokenValid) {
        localStorage.setItem(
          'token',
          JSON.stringify('{"access_token": "", "refresh_token": ""}'),
        );
        window.location.href = '/api/auth';
        return;
      }
    }

    const evtSpotifySource = new EventSource('/api/spotify/sse');
    evtSpotifySource.onmessage = (e) => {
      const ev = JSON.parse(e.data);

      if (
        ev.name == 'spotify.metadata' &&
        playerStore.getSource() != 'spotify'
      ) {
        playerStore.setSource('spotify');
        emit('source_changed', { source: 'spotify', playing: ev });
      }
      emit(ev.name, ev);
    };

    const evtStreamerSource = new EventSource('/api/streamer/sse');
    evtStreamerSource.onmessage = (e) => {
      const ev = JSON.parse(e.data);

      if (
        ev.name == 'streamer.metadata-update' &&
        playerStore.getSource() != 'streamer'
      ) {
        const jackService = new JackService();
        playerStore.setSource('streamer');
        jackService.getStatus().then((currentSource) => {
          emit('source_changed', {
            source: 'streamer',
            playing: currentSource.playing,
          });
        });
      }

      if (ev.name == 'now_playing') {
        emit('streamer.now_playing', ev);
      }

      if (ev.name != 'streamer.metadata-update') {
        emit(ev.name, ev);
      }
    };

    const jackService = new JackService();
    jackService.getStatus().then((currentSource) => {
      if (currentSource) {
        if (currentSource.playing) {
          playerStore.setSource(currentSource.playing.source);

          emit('source_changed', {
            source: currentSource.playing.source,
            playing: currentSource.playing,
          });
        }
      }
    });

    if (themeStore.tab > 0) {
      this.$router.push(this.$router.options.routes[themeStore.tab].path);
    }

    on('audio_changed', (data: any) => {
      const playerStore = usePlayerStore();
      playerStore.setSource(data.source);
    });
  },
  methods: {},
};
</script>

<script lang="ts" setup>
//
</script>
