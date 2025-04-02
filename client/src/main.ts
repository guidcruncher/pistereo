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
import { useEventBus } from './composables/useeventbus';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
registerPlugins(app);

const emitter = useEventBus();

app.config.globalProperties.emitter = emitter;

app.mount('#app');
