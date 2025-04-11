<script>
import { SpotifyService } from '../services/spotify.service';
import { on, emit, off } from '../composables/useeventbus';

export default {
  name: 'Playlists',
  data() {
    return {
      hasData: false,
      playlists: null,
      paging: { offset: 0, limit: 6, page: 1, pageCount: 0 },
    };
  },
  mounted() {
    this.hasData = false;
    this.playlists = null;
    this.paging = { offset: 0, limit: 6, page: 1, pageCount: 0 };
    this.loadPlaylists();
  },
  beforeUnmount() {},
  methods: {
    loadPlaylists() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getPlaylists(this.paging.offset, this.paging.limit)
        .then((response) => {
          if (response) {
            this.playlists = response.items;
            this.paging = response.paging;
            this.hasData = true;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    loadPlaylist(playlist) {
      const spotifyService = new SpotifyService();
      spotifyService.playPlaylist(playlist.uri);
    },
    viewPlaylist(playlist) {
      emit('view_playlist', { playlist: playlist });
    },
    onPageChange() {
      let offset = 0;
      if (this.paging.page > 1) {
        offset = (this.paging.page - 1) * this.paging.limit;
      }
      this.paging.offset = offset;
      this.loadPlaylists();
    },
  },
};
</script>

<template>
  <v-card v-if="hasData" class="mx-auto">
    <v-card-title sticky>My Playlists</v-card-title>
    <v-list lines="false" nav>
      <v-list-item v-for="item in playlists" :key="item.id" :value="item">
        <template #prepend>
          <div style="width: 64px; height: 64px; margin-right: 16px">
            <img
              v-if="item.images"
              :src="item.images[0].url"
              width="64"
              height="64"
            />
          </div>
        </template>
        <v-list-item-title v-text="item.name" />
        <v-list-item-subtitle v-text="item.owner.display_name" />
        <template #append>
          <v-row align="center" justify="center">
            <v-col cols="auto">
              <v-btn
                icon="mdi-play"
                density="compact"
                size="normal"
                @click="loadPlaylist(item)"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                icon="mdi-view-list"
                density="compact"
                size="normal"
                @click="viewPlaylist(item)"
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
