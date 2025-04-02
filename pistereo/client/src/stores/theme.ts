// Utilities
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => {
    return {
      theme:
        localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'),
      pinned: (localStorage.getItem('pinned') ?? 'false') === 'true',
      tab: parseInt(localStorage.getItem('tab') ?? '0'),
    };
  },
  actions: {
    setTheme(theme) {
      this.theme = theme;
      localStorage.setItem('theme', theme);
    },
    toggleTheme() {
      this.theme = this.theme == 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme);
    },
    setPinned(state) {
      localStorage.setItem('pinned', state);
    },
    setTab(tab: number) {
      localStorage.setItem('tab', tab.toString());
    },
    detect() {
      this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      localStorage.setItem('theme', this.theme);
    },
  },
});
