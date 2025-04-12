<script lang="ts">
import { JackService } from '../services/jack.service';
import { SpotifyService } from '../services/spotify.service';
import { on, emit, off } from '../composables/useeventbus';
import { ref } from 'vue';

export default {
  name: 'ShowChooser',
  data() {
    return {
      shows: null,
      show: null,
      hasData: false,
      isActive: false,
      paging: { offset: 0, limit: 8, page: 1, pageCount: 0, total: 0 },
    };
  },
  mounted() {
    this.hasData = false;
    this.shows = null;
    this.show = null;
    this.isActive = false;

    on('podcast.picker', (data: any) => {
      this.show = data.show;
      this.isActive = true;
      this.paging = { offset: 0, limit: 8, page: 1, pageCount: 0, total: 0 };
      this.showTracks();
    });
  },
  beforeDestroy() {
    off('podcast.picker');
  },
  beforeUnmount() {},
  methods: {
    playShow() {
      const spotifyService = new SpotifyService();
      spotifyService.playTrackInPlayList(
        this.show.show.uri,
        this.show.show.uri,
      );
      emit('context_change', { context: this.show.show.uri });
    },
    playShowTrack(track) {
      const spotifyService = new SpotifyService();
      spotifyService.playTrackInPlayList(track.uri, this.show.show.uri);
      emit('context_change', { context: this.show.show.uri });
      this.isActive=false;
    },
    showTracks() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getShowEpisodes(
          this.show.show.id,
          this.paging.offset,
          this.paging.limit,
        )
        .then((episodes) => {
          this.paging = episodes.paging;
          this.shows = episodes.items;
          this.hasData = true;
        });
    },
  },
  onPageChange() {
    let offset = 0;
    if (this.paging.page > 1) {
      offset = (this.paging.page - 1) * this.paging.limit;
    }
    this.paging.offset = offset;
alert(JSON.stringify(this.paging));
    this.showTracks();
  },
};
</script>

<template>
    <v-dialog
      v-model="isActive"
width="auto" fullscreen
    >
<v-card>
 <v-toolbar>
 <v-btn icon="mdi-close" @click="isActive = false"></v-btn>
<v-toolbar-title>Podcast</v-toolbar-title>
</v-toolbar>
          <v-row
            ><v-col cols="2">
              <div style="width: 100px; height: 100px; margin: 16px">
                <img
                  v-if="show.show.images"
                  :src="show.show.images[1].url"
                  width="100"
                  height="100"
                />
              </div> </v-col
            ><v-col cols="10"
              ><div style="margin-top: 16px">
                <h3>{{ show.show.name }}</h3>
                <h5>{{ show.show.publisher }}</h5>
              </div></v-col
            ></v-row
          >

          <v-list lines="false">
            <v-list-item v-for="item in shows" :key="item" :value="item">
              <template #prepend>
                <div style="width: 64px; height: 64px; margin-right: 16px">
                  <img
                    v-if="item.images"
                    :src="item.images[1].url"
                    width="64"
                    height="64"
                  />
                </div>
              </template>
              <v-list-item-title v-text="item.name" />
              <v-list-item-subtitle>{{ item.publisher }} </v-list-item-subtitle>
              <template #append>
                <v-row align="center" justify="center">
                  <v-col cols="auto">
                    <v-btn
                      icon="mdi-play"
                      size="normal"
                      @click="playShowTrack(item)"
                    /> </v-col
                ></v-row>
              </template>
            </v-list-item>
          </v-list>
          <v-pagination
            v-model="paging.page"
            :length="paging.pageCount"
            @update:model-value="onPageChange"
          />
</v-card>
   </v-dialog>
</template>

<style></style>
