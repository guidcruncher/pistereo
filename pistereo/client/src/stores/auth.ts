// Utilities
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      token: JSON.parse(localStorage.getItem('token') ?? '{}') || {},
      userId: localStorage.getItem('id') ?? '',
    };
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', JSON.stringify(token));
    },
    setUserId(id) {
      this.userId = id;
      localStorage.setItem('id', id);
    },
  },
});
