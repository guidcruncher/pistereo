// Utilities
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      token: JSON.parse(
        localStorage.getItem('token') ??
          '{"access_token": "", "refresh_token": ""}',
      ) || { access_token: '', refresh_token: '' },
    };
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', JSON.stringify(token));
    },
  },
});
