<template>
  <v-app :theme="themeStore.theme">
    <v-app-bar color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>PiStereo</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn
        :prepend-icon="
          themeStore.theme === 'light'
            ? 'mdi-weather-sunny'
            : 'mdi-weather-night'
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
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item @click="onThemeChooserClick">
          <v-list-item-title>Toggle Theme</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        {{ themeStore.theme }}
        <router-view />
      </v-container>
    </v-main>
    <v-footer> </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const drawer = ref(false);
const group = ref(null);

watch(group, () => {
  drawer.value = false;
});

function onThemeChooserClick() {
  themeStore.toggleTheme();
}
</script>
