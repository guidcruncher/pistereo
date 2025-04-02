// Utilities
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useSearchStore = defineStore('search', {
  state: () => {
    return {
      query: JSON.parse(
        localStorage.getItem('searchquery') ??
          JSON.stringify({
            text: '',
            valid: false,
            searchTypes: 'album',
            market: '',
          }),
      ),
      paging: JSON.parse(
        localStorage.getItem('searchPaging') ??
          JSON.stringify({
            offset: 0,
            limit: 10,
            page: 1,
            pageCount: 0,
            total: 0,
          }),
      ),
    };
  },
  actions: {
    setQuery(query) {
      this.query = query;
      localStorage.setItem('searchquery', JSON.stringify(query));
    },
    setPaging(paging) {
      this.paging = paging;
      localStorage.setItem('searchpaging', JSON.stringify(paging));
    },
  },
});
