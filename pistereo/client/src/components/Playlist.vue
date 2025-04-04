<script>
import { SpotifyService } from '../services/spotify.service';
import { on, emit, off } from '../composables/useeventbus';

export default {
  name: 'Playlist',
  data() {
    return {
      playlist: null,
      hasData: false,
      tracks: null,
      paging: { offset: 0, limit: 10, page: 1, pageCount: 0 },
    };
  },
  mounted() {
    this.hasData = false;
    this.tracks = null;
    this.paging = { offset: 0, limit: 10, page: 1, pageCount: 0 };
  },
  beforeUnmount() {},
  methods: {
    getPlaylistTracks() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getPlaylistTracks(
          this.playlist.id,
          this.paging.offset,
          this.paging.limit,
        )
        .then((response) => {
          if (response) {
            this.tracks = response.items;
            this.paging = response.paging;
            this.hasData = true;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    onPageChange() {
      let offset = 0;
      if (this.paging.page > 1) {
        offset = (this.paging.page - 1) * this.paging.limit;
      }
      this.paging.offset = offset;
      this.getPlaylistTracks();
    },
    playTrack(item) {
      const spotifyService = new SpotifyService();
      spotifyService.playTrackInPlayList(this.playlist.uri, item.track.uri);
    },
    viewPlaylist(playlist) {
      this.playlist = playlist;
      this.hasData = false;
      this.tracks = null;
      this.paging = { offset: 0, limit: 10, page: 1, pageCount: 0 };
      if (this.playlist) {
        this.getPlaylistTracks();
      }
    },
    viewTrack(item) {
      window.open(item.track.external_urls.spotify);
    },
  },
};
</script>

<template>
  <v-card v-if="hasData" class="mx-auto">
    Playlist - {{ playlist.name }}
    {{ playlist.owner.display_name }}
    <v-list lines="false" nav>
      <v-list-item v-for="item in tracks" :key="item.track.id" :value="item">
        <template #prepend>
          <div style="width: 64px; height: 64px; margin-right: 16px">
            <img
              v-if="item.track.album.images"
              :src="item.track.album.images[0].url"
              width="64"
              height="64"
            />
          </div>
        </template>
        <v-list-item-title v-text="item.track.name" />
        <v-list-item-subtitle v-text="item.track.album.name" />
        <template #append>
          <v-row align="center" justify="center">
            <v-col cols="auto">
              <v-btn
                icon="mdi-play"
                density="compact"
                size="small"
                @click="playTrack(item)"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                icon="mdi-view-list"
                density="compact"
                size="small"
                @click="viewTrack(item)"
              />
            </v-col>
          </v-row>
        </template>
      </v-list-item>
    </v-list>
    <v-pagination
      v-model="paging.page"
      :length="paging.pageCount"
      @update:model-value="onPageChange"
    />
  </v-card>
</template>
