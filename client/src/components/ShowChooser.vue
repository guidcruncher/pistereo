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
      paging: { offset: 0, limit: 10, page: 1, pageCount: 0, total: 0 },
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
    });
  },
  beforeDestroy() {
    off('podcast.picker');
  },
  beforeUnmount() {},
  methods: {
    playShow() {
      const spotifyService = new SpotifyService();
      spotifyService.playTrackInPlayList(this.show.uri, this.show.uri);
    },
    playShowTrack(track) {
      const spotifyService = new SpotifyService();
      spotifyService.playTrackInPlayList(track.uri, this.show.uri);
    },
    showTracks() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getShowEpisodes(this.show.id, this.paging.offset, this.paging.limit)
        .then((episodes) => {
          thie.paging = episodes.paging;
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
    this.offset = offset;
    this.showTracks();
  },
};
</script>

<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="isActive"
      transition="dialog-bottom-transition"
      fullscreen
    >
      <v-card>
        <v-toolbar>
          <v-btn icon="mdi-close" @click="isActive = false"></v-btn>

          <v-toolbar-title>Podcast</v-toolbar-title>
        </v-toolbar>
        <v-row
          ><v-col cols="2">
            <div style="width: 64px; height: 64px; margin-right: 16px">
              <img
                v-if="show.show.images"
                :src="show.show.images[1].url"
                width="64"
                height="64"
              />
            </div> </v-col
          ><v-col cols="10">
            <div class="list-item-title">{{ show.show.name }}</div>
            <div class="list-item-subtitle">{{ show.show.publisher }}</div>
          </v-col></v-row
        >

        <v-list lines="two">
          <v-list-subheader>User Controls</v-list-subheader>

          <v-list-item
            subtitle="Set the content filtering level to restrict apps that can be downloaded"
            title="Content filtering"
            link
          ></v-list-item>

          <v-list-item
            subtitle="Require password for purchase or use password to restrict purchase"
            title="Password"
            link
          ></v-list-item>

          <v-divider></v-divider>

          <v-list-subheader>General</v-list-subheader>

          <v-list-item
            subtitle="Notify me about updates to apps or games that I downloaded"
            title="Notifications"
            @click="notifications = !notifications"
          >
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn
                  v-model="notifications"
                  color="primary"
                ></v-checkbox-btn>
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-list-item
            subtitle="Auto-update apps at any time. Data charges may apply"
            title="Sound"
            @click="sound = !sound"
          >
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn
                  v-model="sound"
                  color="primary"
                ></v-checkbox-btn>
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-list-item
            subtitle="Automatically add home screen widgets"
            title="Auto-add widgets"
            @click="widgets = !widgets"
          >
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn
                  v-model="widgets"
                  color="primary"
                ></v-checkbox-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<style></style>
