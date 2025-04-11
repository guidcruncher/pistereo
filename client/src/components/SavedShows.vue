<script>
import { JackService } from '../services/jack.service';
import { SpotifyService } from '../services/spotify.service';
import { on, emit, off } from '../composables/useeventbus';
import { ref } from 'vue';

export default {
  name: 'SavedShows',
  data() {
    return {
      shows: null,
      show: null,
      hasData: false,
      paging: { offset: 0, limit: 6, page: 1, pageCount: 0, total: 0 },
    };
  },
  mounted() {
    this.hasData = false;
    this.shows = null;
    this.show = null;
    this.getSavedShows();
  },
  beforeUnmount() {},
  methods: {
    playShow(item) {
      const spotifyService = new SpotifyService();
      spotifyService.playTrack(item.show.uri);
    },
    showTracks(show) {
      const spotifyService = new SpotifyService();
      this.show = show;
      this.shows.forEach((s) => {
        if (s.show.id != show.show.id) {
          s.showtracks = false;
        }
      });
      if (!show.paging) {
        show.paging = { offset: 0, limit: 10 };
      }
      if (show.episodes && show.episodes.length > 0) {
        show.showtracks = true;
      } else {
        spotifyService
          .getShowEpisodes(show.show.id, show.paging.offset, show.paging.limit)
          .then((episodes) => {
            show.showtracks = true;
            show.episodes = episodes;
          });
      }
    },
    onEpisodePageChange() {
      let offset = 0;
      if (this.show.paging.page > 1) {
        offset = (this.show.paging.page - 1) * this.show.paging.limit;
      }
      this.show.paging.offset = offset;
      this.showTracks(this.show);
    },
    playShowEpisode(episode, item) {
      const spotifyService = new SpotifyService();
      spotifyService.playTrackInPlayList(this.show.uri, episode.uri);
    },
    onPageChange() {
      let offset = 0;
      if (this.paging.page > 1) {
        offset = (this.paging.page - 1) * this.paging.limit;
      }
      this.paging.offset = offset;
      this.getSavedShows();
    },
    getSavedShows() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getSavedShows(this.paging.offset, this.paging.limit)
        .then((response) => {
          if (response.items.length > 0) {
            this.paging = response.paging;
            this.shows = response.items;
            this.paging.total = response.total;
            this.hasData = true;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<template>
  <v-card>
    <v-list lines="false">
      <v-list-group v-for="item in shows" :key="item" :value="item">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            @click="item.showtracks = item.showtracks ? true : !item.showtracks"
          >
            <template #prepend>
              <div style="width: 64px; height: 64px; margin-right: 16px">
                <img
                  v-if="item.show.images"
                  :src="item.show.images[1].url"
                  width="64"
                  height="64"
                />
              </div>
            </template>
            <v-list-item-title v-text="item.show.name" />
            <v-list-item-subtitle
              >{{ item.show.publisher }}
            </v-list-item-subtitle>
            <template #append>
              <v-row align="center" justify="center">
                <v-col cols="auto">
                  <v-btn
                    icon="mdi-play"
                    density="compact"
                    size="normal"
                    @click="playShow(item)"
                  />
                  <v-btn
                    icon="mdi-chevron-up"
                    density="compact"
                    size="normal"
                    v-if="item.showtracks"
                    @click="item.showtracks = false"
                  />
                  <v-btn
                    icon="mdi-chevron-down"
                    density="compact"
                    size="normal"
                    v-if="!item.showtracks"
                    @click="showTracks(item)"
                  /> </v-col
              ></v-row>
            </template>
          </v-list-item>
        </template>
        <v-list-item
          v-for="episode in item.episodes.items"
          v-if="item.showtracks && item.episodes"
          :key="episode"
          :value="episode"
        >
          <v-list-item-title>{{ episode.name }} </v-list-item-title>
          <template #append>
            <v-row align="center" justify="center">
              <v-col cols="auto">
                <v-btn
                  icon="mdi-play"
                  density="compact"
                  size="normal"
                  @click="playShowEpisode(episode, item)"
                /> </v-col
            ></v-row>
          </template>
        </v-list-item>
        <v-pagination
          v-if="item.showtracks && item.episodes"
          v-model="item.episodes.paging.page"
          :length="item.episodes.paging.pageCount"
          @update:model-value="onEpisodePageChange"
        />
      </v-list-group>
    </v-list>
    <v-pagination
      v-model="paging.page"
      :length="paging.pageCount"
      @update:model-value="onPageChange"
    />
  </v-card>
</template>

<style>
.spacer {
  padding: 5px;
}
.stationlogo {
  width: 80px !important;
  height: 80px !important;
  overflow: hidden;
}
.stationlogo img {
  max-width: 100%;
  max-height: 100%;
}
</style>
