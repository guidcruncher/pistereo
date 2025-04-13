<script lang="ts">
import { SpotifyService } from '../services/spotify.service';

export default {
  name: 'MyProfile',
  data() {
    return {
      profile: {} as PublicUser,
      profileImage: { url: '', width: 0, height: 0 },
      message: '',
      hasData: false,
    };
  },
  mounted() {
    this.hasData = false;
    this.message = '';
    this.profile = {} as PublicUser;
    this.profileImage = { url: '', width: 0, height: 0 };
    this.getMyProfile();
  },
  methods: {
    getMyProfile() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getMyProfile()
        .then((response) => {
          this.profile = response;
          this.profileImage = this.profile.images[0];
          this.hasData = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
<script lang="ts" setup>
function navigateToUrl(url: string) {
  window.open(url);
}
</script>

<template>
  <v-card v-if="hasData">
    <v-card-title>
      {{ profile.display_name }}
    </v-card-title>
    <v-card-item>
      {{ profile.id }}
      <div class="profileimg">
        <img :src="profileImage.url">
      </div>
    </v-card-item>
    <v-card-actions>
      <v-btn @click="navigateToUrl(profile.external_urls.spotify)">
        View on Spotify
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style>
.profileimg {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}
.profileimg img {
  max-width: 100%;
  max-height: 100%;
}
</style>
