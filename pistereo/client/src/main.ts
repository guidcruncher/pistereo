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
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

registerPlugins(app);

const themeStore = useThemeStore();
const authStore = useAuthStore();

if (!authStore.token.access_token) {
  window.location.href = '/api/auth';
}

app.mount('#app');
