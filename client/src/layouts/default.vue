<template>
  <v-app :theme="themeStore.theme">
    <v-app-bar color="primary">
      <template #prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <template v-if="drawer">
          <v-btn
            v-if="!pinned"
            size="small"
            icon="mdi-pin"
            @click.stop="onPinClick()"
          />
          <v-btn
            v-if="pinned"
            size="small"
            icon="mdi-pin-off"
            @click.stop="onPinClick()"
          />
        </template>
      </template>

      <v-app-bar-title>PiStereo</v-app-bar-title>

      <v-spacer />

      <v-btn
        :prepend-icon="
          themeStore.theme === 'light'
            ? 'mdi-weather-sunny'
            : 'mdi-weather-night'
        "
        slim
        @click="onThemeChooserClick"
      />

      <template #append>
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props" />
          </template>
          <v-list>
            <v-list-item @click="onThemeChooserClick">
              <v-list-item-title>Toggle Theme</v-list-item-title>
            </v-list-item>
            <v-list-item @click="onLogoutClick">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :permanent="pinned"
      :temporary="!pinned"
    >
      <v-list slim density="compact">
        <v-list-item>
          <MyProfileBanner />
        </v-list-item>
        <v-divider />
        <v-list-item>
          <CompactPlayer />
          <RadioPlayer />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-tabs v-model="tab">
          <v-tab
            prepend-icon="mdi-home"
            text="Home"
            @click.stop="goto('/', 0)"
          />
          <v-tab
            prepend-icon="mdi-play"
            text="Now Playing"
            @click.stop="goto('/nowplaying', 1)"
          />
          <v-tab
            prepend-icon="mdi-view-list"
            text="Playlists"
            @click.stop="goto('/playlists', 2)"
          />
          <v-tab
            prepend-icon="mdi-library"
            text="Library"
            @click.stop="goto('/library', 3)"
          />
          <v-tab
            prepend-icon="mdi-magnify"
            text="Explore"
            @click.stop="goto('/explore', 4)"
          />
        </v-tabs>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useThemeStore } from '@/stores/theme';
import { on, emit, off } from '../composables/useeventbus';

const playerStore = usePlayerStore();
const themeStore = useThemeStore();
const drawer = ref(false || themeStore.pinned);
const pinned = ref(themeStore.pinned);
const tab = ref(themeStore.tab);

function onThemeChooserClick() {
  themeStore.toggleTheme();
}

function onLogoutClick() {
  localStorage.setItem(
    'token',
    JSON.stringify('{"access_token": "", "refresh_token": ""}'),
  );
  window.location.href = '/';
}

function onPinClick() {
  pinned.value = !pinned.value;
  themeStore.setPinned(pinned.value);
}
</script>

<script lang="ts">
export default {
  name: 'Default',
  data() {
    return {
      tab: 1,
    };
  },
  mounted() {},
  methods: {
    goto(url, tab) {
      const themeStore = useThemeStore();
      themeStore.setTab(tab);
      this.$router.push(url);
    },
  },
};
</script>
