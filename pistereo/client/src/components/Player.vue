<script lang="ts">
import { SpotifyService } from '../services/spotify.service';

export default {
  name: 'player',
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
<v-btn color="primary"  rounded="xl" size="x-large"><v-icon icon="mdi-skip-previous"></v-icon></v-btn>
<v-btn color="primary"  rounded="xl" size="x-large"><v-icon icon="mdi-play"></v-icon></v-btn>
<v-btn color="primary"  rounded="xl" size="x-large"><v-icon icon="mdi-pause"></v-icon></v-btn>
<v-btn color="primary"  rounded="xl" size="x-large"><v-icon icon="mdi-stop"></v-icon></v-btn>
<v-btn color="primary"  rounded="xl" size="x-large"><v-icon icon="mdi-skip-next"></v-icon></v-btn>

	
</template>

<style>
</style>
