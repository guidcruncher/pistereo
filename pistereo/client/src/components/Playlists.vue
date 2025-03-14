<script>
import { SpotifyService } from '../services/spotify.service';

export default {
  name: 'playlists',
  data() {
    return {
      hasData: false,
      playlists: null,
      paging: { offset: 0, limit: 20, page: 1, pageCount: 0 },
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
  },
  mounted() {
    this.hasData = false;
    this.playlists = null;
    this.paging = { offset: 0, limit: 20, page: 1, pageCount: 0 };
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
      >
<template v-slot:prepend>
              <img :src="item.images[2].url" :width="item.images[2].width" :height="item.images[2].height" />
            </template>

            <v-list-item-title v-text="item.name"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>
