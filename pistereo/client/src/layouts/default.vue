<template>
  <v-responsive class="border rounded" max-height="300">
    <v-app :theme="theme">
      <v-app-bar class="px-3">
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="
            theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
          "
          text="Toggle Theme"
          slim
          @click="onThemeChooserClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>
      <AppFooter />
    </v-app>
  </v-responsive>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const theme = ref('light');

function onThemeChooserClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}
</script>
