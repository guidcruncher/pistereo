// Utilities
import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', {
  state: () => {
    return {
      source: '',
    };
  },
  actions: {
    setSource(source) {
      this.source = source;
    },
    getSource() {
      return this.source;
    },
  },
});
