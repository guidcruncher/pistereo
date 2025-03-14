<script>
import { SpotifyService } from '../services/spotify.service';

export default {
  name: 'playlists',
  data() {
    return {
      hasData: false,
      playlists: null,
      paging: { offset: 0, limit: 4, page: 1, pageCount: 0 },
    };
  },
  methods: {
    getPlaylists() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getPlaylists(this.paging.offset, this.paging.limit)
        .then((response) => {
          if (response) {
            this.playlists = response;
            if (this.paging.offset == 0) {
              this.paging.page = 1;
            } else {
              this.paging.page = this.paging.offset / this.pagimg.limit + 1;
            }
            this.paging.pageCount = Math.ceil(
              response.total / this.paging.limit,
            );
            this.hasData = true;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    loadPlaylist(playlist) {
      const spotifyService = new SpotifyService();
      spotifyService.playItemOnPlayer(playlist.uri);
    },
    onPageChange(pageNumber) {
      let offset = 0;
      if (pageNumber > 1) {offset = pageNumber * this.paging.limit;}
      this.paging.offset = offset;
      this.getPlaylists();
    }
  },
  mounted() {
    this.hasData = false;
    this.playlists = null;
    this.paging = { offset: 0, limit: 4, page: 1, pageCount: 0 };
    this.getPlaylists();
  },
};
</script>

<template>
  <v-card class="mx-auto" max-width="600" v-if="hasData">
    <v-list lines="false" nav>
      <v-list-subheader inset>Playlists</v-list-subheader>
      <v-list-item
        v-for="item in playlists.items"
        :key="item.id"
        :value="item"
        @click="loadPlaylist(item)"
      >
        <template v-slot:prepend>
          <div style="width: 64px; height: 64px; margin-right: 16px">
            <img
              v-if="item.images"
              :src="item.images[0].url"
              width="64"
              height="64"
            />
          </div>
        </template>
        <v-list-item-title v-text="item.name"></v-list-item-title>
        <v-list-item-subtitle
          v-text="item.owner.display_name"
        ></v-list-item-subtitle>
      </v-list-item>
    </v-list>
     <v-pagination
        v-model="playlists.items"
        :length="paging.pageCount"
        @input="onPageChange"
      ></v-pagination>
  </v-card> 
</template>
