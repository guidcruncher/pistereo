<script>
import { JackService } from '../services/jack.service';
import { SpotifyService } from '../services/spotify.service';
import { on, emit, off } from '../composables/useeventbus';
import { ref } from 'vue';

export default {
  name: 'SavedAlbums',
  data() {
    return {
      albums: null,
      hasData: false,
      paging: { offset: 0, limit: 6, page: 1, pageCount: 0, total: 0 },
    };
  },
  mounted() {
    this.hasData = false;
    this.albums = null;
    this.getSavedAlbums();
  },
  beforeUnmount() {},
  methods: {
    playAlbum(item) {
      const spotifyService = new SpotifyService();
      spotifyService.playTrackInPlayList(
        item.album.tracks.items[0].uri,
        item.album.uri,
      );
    },
    playAlbumTrack(track, item) {
      const spotifyService = new SpotifyService();
      spotifyService.playTrackInPlayList(track.uri, item.album.uri);
    },
    onPageChange() {
      let offset = 0;
      if (this.paging.page > 1) {
        offset = (this.paging.page - 1) * this.paging.limit;
      }
      this.paging.offset = offset;
      this.getSavedAlbums();
    },
    getSavedAlbums() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getSavedAlbums(this.paging.offset, this.paging.limit)
        .then((response) => {
          if (response.items.length > 0) {
            this.paging = response.paging;
            this.albums = response.items;
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
      <v-list-group v-for="item in albums" :key="item" :value="item">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            @click="item.showtracks = item.showtracks ? true : !item.showtracks"
          >
            <template #prepend>
              <div style="width: 64px; height: 64px; margin-right: 16px">
                <img
                  v-if="item.album.images"
                  :src="item.album.images[1].url"
                  width="64"
                  height="64"
                />
              </div>
            </template>
            <v-list-item-title v-text="item.album.name" />
            <v-list-item-subtitle
              >{{
                item.album.artists
                  .map((a) => {
                    return a.name;
                  })
                  .join(', ')
              }}
            </v-list-item-subtitle>
            <template #append>
              <v-row align="center" justify="center">
                <v-col cols="auto">
                  <v-btn
                    icon="mdi-play"
                    density="compact"
                    size="normal"
                    @click="playAlbum(item)"
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
                    @click="item.showtracks = true"
                  /> </v-col
              ></v-row>
            </template>
          </v-list-item>
        </template>
        <v-list-item
          v-for="track in item.album.tracks.items"
          v-if="item.showtracks"
          :key="track"
          :value="track"
        >
          <v-list-item-title
            >{{ track.track_number }}. {{ track.name }}</v-list-item-title
          >
          <template #append>
            <v-row align="center" justify="center">
              <v-col cols="auto">
                <v-btn
                  icon="mdi-play"
                  density="compact"
                  size="normal"
                  @click="playAlbumTrack(track, item)"
                /> </v-col
            ></v-row>
          </template>
        </v-list-item>
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
