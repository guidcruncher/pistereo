<script>
import { SpotifyService } from '../services/spotify.service';

export default {
  name: 'profile',
  data() {
    return {
      profile: null,
      message: '',
    };
  },
  methods: {
    getMyProfile() {
      const spotifyService = new SpotifyService();
      spotifyService
        .getMyProfile()
        .then((response) => {
          this.profile = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.message = '';
    this.getMyProfile();
  },
};
</script>

<template>
  {{ profile }}
</template>
