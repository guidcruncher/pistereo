/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins';
import { createPinia } from 'pinia';

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';
import { SpotifyService } from './services/spotify.service';

const pinia = createPinia();
const app = createApp(App);

registerPlugins(app);
app.use(pinia);

registerPlugins(app);

const themeStore = useThemeStore();
const authStore = useAuthStore();

if (!authStore.token.access_token || authStore.token.access_token == '') {
  window.location.href = '/api/auth';
}

const spotifyService = new SpotifyService();
spotifyService
  .getMyProfile()
  .then((response) => {
    authStore.setUserId(response.id);
    app.mount('#app');
  })
  .catch((e) => {
    console.log(e);
  });
