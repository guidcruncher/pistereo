<script lang="ts" setup>
const rules = {
  required: (value) => !!value || 'Required',
};
</script>
<script lang="ts">
import { SearchTypes, SpotifyService } from '../services/spotify.service';
import { TunerService } from '../services/tuner.service';
import { on, emit, off } from '../composables/useeventbus';
import { useSearchStore } from '@/stores/search';

export default {
  name: 'Search',
  data() {
    return {
      searchTypes: SearchTypes,
      query: { text: '', valid: false, searchTypes: '', market: '' },
      hasData: false,
      loading: false,
      data: {} as any,
      results: {} as any,
      paging: { offset: 0, limit: 10, page: 1, pageCount: 0, total: 0 },
    };
  },
  mounted() {
    const searchStore = useSearchStore();
    this.query = searchStore.query;
    this.hasData = false;
    this.results = {};
    this.paging = searchStore.paging;
    if (this.paging.total > 0) {
      this.loadSearchPage();
    }
  },
  beforeUnmount() {},
  methods: {
    getResults() {
      switch (this.query.searchTypes) {
        case 'album':
          return this.data.albums;
        case 'artist':
          return this.data.artists;
        case 'playlist':
          return this.data.playlists;
        case 'track':
          return this.data.tracks;
        case 'show':
          return this.data.shows;
        case 'episode':
          return this.data.episodes;
        case 'audiobook':
          return this.data.audiobooks;
      }
      return {};
    },
    loadSpotifySearchPage() {
      const searchStore = useSearchStore();
      const spotifyService = new SpotifyService();
      this.hasData = false;
      searchStore.setQuery(this.query);
      spotifyService
        .search(this.query, this.paging.offset, this.paging.limit)
        .then((response) => {
          if (response) {
            this.data = response;
            this.results = this.getResults();
            this.paging = this.results.paging;
            searchStore.setPaging(this.paging);
            this.loading = false;
            this.hasData = true;
          }
        })
        .catch((e) => {
          this.loading = false;
          this.hasData = false;
          console.log(e);
        });
    },
    loadRadioSearchPage({ done }) {
      const searchStore = useSearchStore();
      const tunerService = new TunerService();
      searchStore.setQuery(this.query);

      tunerService
        .searchStations(thiss.query.text, this.paging.offset, 50)
        .then((response) => {
          if (response) {
            if (done) {
              if (response.length > 0) {
                this.data = response;
                this.results = response;
                this.paging.total += response.length;
                searchStore.setPaging(this.paging);
                this.hasData = true;
                this.paging.offset += 50;
                done('ok');
              } else {
                done('empty');
              }
            } else {
              this.data = response;
              this.results = response;
              this.paging.total += response.length;
              searchStore.setPaging(this.paging);
              this.loading = false;
              this.hasData = true;
            }
          } else {
            if (done) {
              this.loading = false;
              done('empty');
            }
          }
        })
        .catch((e) => {
          console.log(e);
          if (done) {
            done('error');
            this.loading = false;
            this.hasData = false;
          }
        });
    },
    loadSearchPage() {
      const done = (arg) => {};
      if (this.query.searchTypes == 'radio') {
        this.loadRadioSearchPage({ done });
      } else {
        this.loadSpotifySearchPage();
      }
    },
    changeFilter() {
      if (this.query.searchTypes == 'radio') {
        if (this.query.valid) {
          this.doSearch();
        }
      } else {
        if (this.data && this.data[this.query.searchTypes]) {
          this.results = this.getResults();
          this.paging = this.results.paging;
        } else {
          if (this.query.valid) {
            this.doSearch();
          }
        }
      }
    },
    doSearch() {
      this.loading = true;
      this.hasData = false;
      this.paging.offset = 0;
      //  searchStore.setPaging(this.paging);
      this.paging.total = 0;
      this.loadSearchPage();
    },
    onPageChange() {
      let offset = 0;
      if (this.paging.page > 1) {
        offset = (this.paging.page - 1) * this.paging.limit;
      }
      this.paging.offset = offset;
      this.loadSearchPage();
    },
    playTrack(item) {
      const spotifyService = new SpotifyService();
      spotifyService.playTrack(item.uri);
    },
    playRadio(item) {
      const tunerService = new TunerService();
      tunerService.playStation(item.stationuuid);
    },
    saveRadio(item) {
      const tunerService = new TunerService();
      tunerService.saveStationPreset(item.stationuuid);
    },
    viewRadio(item) {
      window.open(item.homepage);
    },
    viewPlaylist(playlist) {},
    viewTrack(item) {
      if (!['playlist'].includes(this.query.searchTypes)) {
        window.open(item.external_urls.spotify);
      } else {
        this.viewPlaylist(item);
      }
    },
  },
};
</script>

<template>
  <v-form v-model="query.valid" @submit.prevent>
    <v-text-field
      v-model="query.text"
      :rules="[rules.required]"
      label="Search for"
    />
    <v-chip-group
      v-model="query.searchTypes"
      mandatory
      @update:model-value="changeFilter"
    >
      <v-chip
        v-for="key in Object.keys(searchTypes)"
        :key="searchTypes[key]"
        variant="outlined"
        filter
        :text="key"
        :value="searchTypes[key]"
      />
    </v-chip-group>
    <v-btn
      :disabled="!query.valid"
      prepend-icon="mdi-magnify"
      type="submit"
      color="primary"
      block
      @click="doSearch"
    >
      Search
    </v-btn>
  </v-form>
  <template v-if="query.searchTypes != 'radio'">
    <v-skeleton-loader :loading="loading" type="list-item-two-line">
      <v-list v-if="hasData" nav>
        <v-list-item v-for="item in results.items" :key="item" :value="item">
          <template #prepend>
            <div style="width: 64px; height: 64px; margin-right: 16px">
              <img
                v-if="item.images"
                :src="item.images[0].url"
                width="64"
                height="64"
              />
              <img
                v-if="item.album"
                :src="item.album.images[0].url"
                width="64"
                height="64"
              />
            </div>
          </template>
          <v-list-item-title v-text="item.name" />
          <v-list-item-subtitle v-if="item.album" v-text="item.album.name" />
          <template #append>
            <v-row align="center" justify="center">
              <v-col cols="auto">
                <v-btn
                  icon="mdi-play"
                  density="compact"
                  size="normal"
                  @click="playTrack(item)"
                />
              </v-col>
              <v-col cols="auto">
                <v-btn
                  icon="mdi-view-list"
                  density="compact"
                  size="normal"
                  @click="viewTrack(item)"
                />
              </v-col>
            </v-row>
          </template>
        </v-list-item>
      </v-list>
      <v-pagination
        v-if="hasData"
        v-model="paging.page"
        :length="paging.pageCount"
        @update:model-value="onPageChange"
      />
    </v-skeleton-loader>
  </template>

  <template v-if="query.searchTypes == 'radio'">
    <v-infinite-scroll
      v-if="hasData"
      :height="500"
      :items="results"
      @load="loadRadioSearchPage"
    >
      <v-skeleton-loader :loading="loading" type="list-item-two-line">
        <v-list>
          <v-list-item v-for="item in results" :key="item" :value="item">
            <template #prepend>
              <div style="width: 64px; height: 64px; margin-right: 16px">
                <img
                  v-if="item.favicon"
                  :src="item.favicon"
                  width="64"
                  height="64"
                />
              </div>
            </template>
            <v-list-item-title v-text="item.name" />
            <v-list-item-subtitle>
              codec={{ item.codec }}, bitrate={{ item.bitrate }}kbps, votes={{
                item.votes
              }}, clicks={{ item.clickcount }}<br /><a :href="item.homepage">{{
                item.homepage
              }}</a>
            </v-list-item-subtitle>
            <template #append>
              <v-row align="center" justify="center">
                <v-col cols="auto">
                  <v-btn
                    icon="mdi-play"
                    density="compact"
                    size="normal"
                    @click="playRadio(item)"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    icon="mdi-view-list"
                    density="compact"
                    size="normal"
                    @click="viewRadio(item)"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    icon="mdi-content-save"
                    density="compact"
                    size="normal"
                    @click="saveRadio(item)"
                  />
                </v-col>
              </v-row>
            </template>
          </v-list-item>
        </v-list>
      </v-skeleton-loader>
    </v-infinite-scroll>
  </template>
</template>
