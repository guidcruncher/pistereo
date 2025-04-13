<script lang="ts">
import { SpotifyService } from '../services/spotify.service';
import { TunerService } from '../services/tuner.service';
import { JackService } from '../services/jack.service';
import { on, emit, off } from '../composables/useeventbus';
import { usePlayerStore } from '@/stores/player';

export default {
  name: 'NowPlaying',
  data() {
    return {
      hasData: false,
      context: '',
      track: {} as any,
      queue: [] as any[],
      player: {} as any,
      source: {} as any,
    };
  },
  mounted() {
    const playerStore = usePlayerStore();
    this.hasData = false;
    this.context = '';
    this.track = { is_loaded: false, is_playing: false };
    this.player = {};
    this.queue = [] as any[];
    this.source = playerStore.getSource();
    on('playing', (data: any) => {
      this.getPlayerQueue();
    });

    on('context_change', (data: any) => {
      this.context = data.context;
      this.getPlayerQueue();
    });

    this.getPlayerState();
    this.getPlayerQueue();

    on('source_changed', (data: any) => {
      if (data.source == 'spotify') {
        this.getPlayerState();
        this.getPlayerQueue();
      }
    });
  },
  beforeUnmount() {
    off('playing');
    off('source_changed');
    off('context_change');
  },
  methods: {
    getPlayerState() {
      const jackService = new JackService();
      const spotifyService = new SpotifyService();
      spotifyService
        .getLibrespotState()
        .then((response) => {
          if (response) {
            this.player = response;
            this.player.is_playing = !(response.stopped || response.paused);
            this.player.is_loaded = true;
            this.hasData = true;
            this.setTrack(response.track);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getPlayerQueue() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getPlayerQueue()
        .then((response) => {
          if (response) {
            this.queue = response.queue;
            this.hasData = true;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    setTrack(s: any) {
      if (s) {
        const track = s;
        track.progressPercent = Math.abs(
          (100 / track.duration) * track.position,
        );
        track.artist = track.artist_names.join(', ');
        this.track = track;
      }
    },
    playTrack(item) {
      const spotifyService = new SpotifyService();
      if (this.context === '') {
        spotifyService.playTrack(item.uri);
      } else {
        spotifyService.playTrackInPlayList(this.context, item.uri);
      }
    },
    viewTrack(item) {
      window.open(item.external_urls.spotify);
    },
  },
};
</script>
<template>
  <v-container>
    <v-container v-if="hasData">
      <v-row v-if="track.album_cover_url">
        <v-col cols="12">
          <div class="centre">
            <div class="albumimgbig">
              <img :src="track.album_cover_url">
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="centre">
            <h2>{{ track.album_name }}</h2>
            <h3>{{ track.name }}</h3>
            <h4>{{ track.artists }}</h4>
          </div>
        </v-col>
      </v-row>
      <v-card>
        <v-card-title sticky>
          Queue
        </v-card-title>
        <v-list nav>
          <v-list-item
            v-for="item in queue"
            :key="item.id"
            :value="item"
          >
            <template
              v-if="item"
              #prepend
            >
              <div
                v-if="item.album"
                style="width: 64px; height: 64px; margin-right: 16px"
              >
                <img
                  v-if="item.album.images"
                  :src="item.album.images[0].url"
                  width="64"
                  height="64"
                >
              </div>
              <div
                v-if="item.show"
                style="width: 64px; height: 64px; margin-right: 16px"
              >
                <img
                  v-if="item.show.images"
                  :src="item.show.images[0].url"
                  width="64"
                  height="64"
                >
              </div>
            </template>
            <v-list-item-title v-text="item.name" />
            <v-list-item-subtitle
              v-if="item.album"
              v-text="item.album.name"
            />
            <template #append>
              <v-row
                align="center"
                justify="center"
              >
                <v-col cols="auto">
                  <v-btn
                    icon="mdi-play"
                    density="compact"
                    size="normal"
                    @click="playTrack(item)"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    icon="mdi-view-list"
                    density="compact"
                    size="normal"
                    @click="viewTrack(item)"
                  />
                </v-col>
              </v-row>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </v-container>
</template>

<style>
.albumimgbig {
  margin: 0 auto;
  width: 200px;
  height: 200px;
  overflow: hidden;
}
.albumimgbig img {
  max-width: 100%;
  max-height: 100%;
}
.centre {
  text-align: center;
  margin: 0 auto;
}
</style>
