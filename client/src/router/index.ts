/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
// import { routes } from "vue-router/auto-routes";
import PlaylistsPage from '../pages/PlaylistsPage.vue';
import IndexPage from '../pages/IndexPage.vue';
import ExplorePage from '../pages/ExplorePage.vue';
import LibraryPage from '../pages/LibraryPage.vue';
import NowPlayingPage from '../pages/NowPlayingPage.vue';
import AboutPage from '../pages/AboutPage.vue';
import ToolsPage from '../pages/ToolsPage.vue';

const routes = [
  {
    name: 'index',
    path: '/',
    component: IndexPage,
  },
  {
    name: 'nowplaying',
    path: '/nowplaying',
    component: NowPlayingPage,
  },
  {
    name: 'library',
    path: '/library',
    component: LibraryPage,
  },
  {
    name: 'explore',
    path: '/explore',
    component: ExplorePage,
  },
  {
    name: 'tools',
    path: '/tools',
    component: ToolsPage,
  },
  {
    path: '/about',
    component: AboutPage,
  },
  {
    path: '/:pathMatch(.*)*',
    component: IndexPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
