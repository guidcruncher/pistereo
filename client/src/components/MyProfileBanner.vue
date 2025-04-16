<script lang="ts">
import { SpotifyService } from '../services/spotify.service';

export default {
  name: 'MyProfileBanner',
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
  <div style="display: table">
    <div v-if="profileImage" class="profileimg" style="display: table-cell">
      <img :src="profileImage.url" />
    </div>
    <div v-if="profile" style="display: table-cell; padding-left: 5px; vertical-align: middle">
      <h3>{{ profile.display_name }}</h3>
    </div>
  </div>
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
