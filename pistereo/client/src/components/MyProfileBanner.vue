<script lang="ts">
import { SpotifyService } from '../services/spotify.service';

export default {
  name: 'myprofile',
  data() {
    return {
      profile: {} as PublicUser,
      profileImage: { url: '', width: 0, height: 0 },
      message: '',
      hasData: false,
    };
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
  mounted() {
    this.hasData = false;
    this.message = '';
    this.profile = {} as PublicUser;
    this.profileImage = { url: '', width: 0, height: 0 };
    this.getMyProfile();
  },
};
</script>
<script lang="ts" setup>
function navigateToUrl(url: string) {
  window.open(url);
}
</script>

<template>
  <div style="display: table">
    <div class="profileimg" style="display: table-cell">
      <img :src="profileImage.url" />
    </div>
    <div style="display: table-cell; padding-left: 5px; vertical-align: middle">
      <h2>{{ profile.display_name }}</h2>
    </div>
  </div>
  <v-btn @click="navigateToUrl(profile.external_urls.spotify)"
    >View on Spotify</v-btn
  >
</template>

<style>
.profileimg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
}
.profileimg img {
  max-width: 100%;
  max-height: 100%;
}
</style>
