<template>
  <v-app :theme="theme">
    <v-app-bar color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>PiStereo</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn
        :prepend-icon="
          theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
        "
        slim
        @click="onThemeChooserClick"
      ></v-btn>

      <template v-slot:append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-list-item @click="onThemeChooserClick">
              <v-list-item-title>Toggle Theme</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <v-footer> </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const theme = ref('light');

function onThemeChooserClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}
</script>
