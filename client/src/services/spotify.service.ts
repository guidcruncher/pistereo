import { ServiceBase } from './service-base';
import axios, { type AxiosResponse } from 'axios';
import { JackService } from './jack.service';

export class SpotifyService extends ServiceBase {
  constructor() {
    super('/api/spotify');
  }

  public async getMyProfile(): Promise<PublicUser> {
    const response: AxiosResponse<PublicUser> =
      await this.client().get('/profile/me');
    return response.data;
  }

  public async isTokenValid(): Promise<boolean> {
    const response: AxiosResponse<PublicUser> = await this.client({
      disableInterceptor: true,
    }).get('/profile/me');

    if (response) {
      return true;
    }
    return false;
  }

  public async stop() {
    const response: AxiosResponse<any> = await this.client({
      baseUrl: '',
    }).put('/inputs/stop/librespot');
    return response.data;
  }

  public async getDevice(): Promise<DeviceObject> {
    const response: AxiosResponse<DeviceObject> =
      await this.client().get('/player/default');
    return response.data;
  }

  public async setDeviceVolume(volume: number): Promise<any> {
    const params = new URLSearchParams();
    params.append('volume_percent', volume.toString());
    const response: AxiosResponse<DeviceObject> = await this.client({
      baseUrl: '/api/spotify',
    }).put('/player/default/volume?' + params.toString(), {});
    return response.data;
  }

  public async search(query: any, offset: number, limit: number): Promise<any> {
    const params = new URLSearchParams();
    let searchTypes: string[] = [];
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());

    if (Array.isArray(query.searchTypes)) {
      searchTypes = query.searchTypes;
    } else {
      searchTypes = [query.searchTypes];
    }
    const response: AxiosResponse = await this.client().post(
      '/search?' + params.toString(),
      {
        q: query.text,
        types: searchTypes,
        market: query.market,
      },
    );
    return response.data;
  }

  public async getPlayerState(): Promise<any> {
    const response: AxiosResponse = await this.client().get('/player');
    return response.data;
  }

  public async getLibrespotState(): Promise<any> {
    const response: AxiosResponse = await this.client({
      baseUrl: '/api/librespot',
    }).get('');
    return response.data;
  }

  public async getPlayerQueue(): Promise<any> {
    const response: AxiosResponse = await this.client().get('/player/queue');
    return response.data;
  }
  public async getPlaylistDetail(id: string): Promise<any> {
    const response: AxiosResponse = await this.client().get(
      '/playlists/' + encodeURIComponent(id),
    );
    return response.data;
  }

  public async getPlaylistTracks(
    id: string,
    offset: number,
    limit: number,
  ): Promise<any> {
    const params = new URLSearchParams();
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());
    const response: AxiosResponse = await this.client().get(
      '/playlists/' + encodeURIComponent(id) + '/tracks?' + params.toString(),
    );
    return response.data;
  }

  public async getTopTracks(offset: number, limit: number): Promise<any> {
    const params = new URLSearchParams();
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());
    const response: AxiosResponse = await this.client().get(
      '/profile/me/top/tracks?' + params.toString(),
    );
    return response.data;
  }

  public async getPlaylists(
    offset: number,
    limit: number,
  ): Promise<PagedList<Playlist>> {
    const params = new URLSearchParams();
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());

    const response: AxiosResponse<PagedList<Playlist>> =
      await this.client().get('/playlists?' + params.toString());
    return response.data;
  }

  public async getSavedAlbums(
    offset: number,
    limit: number,
  ): Promise<PagedList<any>> {
    const params = new URLSearchParams();
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());
    const response: AxiosResponse<PagedList<any>> = await this.client().get(
      '/profile/me/albums?' + params.toString(),
    );
    return response.data;
  }

  public async playItemOnPlayer(contextUri: string): Promise<any> {
    const response: AxiosResponse = await this.client().put(
      '/player/default/play',
      {
        contextUri: contextUri,
        uris: [],
        positionMs: 0,
      },
    );
    return response.data;
  }

  public async playTrack(track_uri: string): Promise<any> {
    const jackService = new JackService();
    await jackService.stop();
    let params = new URLSearchParams();
    params.append('context', track_uri);
    const response: AxiosResponse = await this.client({
      baseUrl: '/api/librespot',
    }).put('/play?' + params.toString());
    return response.data;
  }

  public async playTrackInPlayList(
    playlist_uri: string,
    track_uri: string,
  ): Promise<any> {
    const jackService = new JackService();
    await jackService.stop();
    let params = new URLSearchParams();
    params.append('context', track_uri);
    params.append('uri', playlist_uri);
    const response: AxiosResponse = await this.client({
      baseUrl: '/api/librespot',
    }).put('/play?' + params.toString());
    return response.data;
  }

  public async playPlaylist(playlist_uri: string): Promise<any> {
    const jackService = new JackService();
    await jackService.stop();
    let params = new URLSearchParams();
    params.append('uri', playlist_uri);
    const response: AxiosResponse = await this.client({
      baseUrl: '/api/librespot',
    }).put('/play?' + params.toString());
    return response.data;
  }

  public async playerOp(id: string, command: string): Promise<any> {
    const playerCommand = async (id, command) => {
      let response: AxiosResponse = {} as AxiosResponse;
      const params = new URLSearchParams();
      params.append('device_id', id);

      switch (command) {
        case 'connect':
          response = await this.client().put('/player', {
            deviceids: [id],
            play: true,
          });
          return response.data;
        case 'previous':
          response = await this.client({
            baseUrl: 'api/librespot',
          }).put('previous', {});
          return response.data;
        case 'play':
          response = await this.client({
            baseUrl: 'api/librespot',
          }).put('toggleplayback', {});
          return response.data;
        case 'pause':
          response = await this.client({
            baseUrl: 'api/librespot',
          }).put('toggleplayback', {});
          return response.data;
        case 'stop':
          response = await this.client({
            baseUrl: 'api/librespot',
          }).put('stop', {});
          return response.data;
        case 'next':
          let queue = await this.getPlayerQueue();
          let nextTrack = queue.currently_playing.uri;
          if (queue && queue.queue.length > 0) {
            nextTrack = queue.queue[0].uri;
          }
          params.append('uri', nextTrack);
          response = await this.client({
            baseUrl: 'api/librespot',
          }).put('next?' + params.toString(), {});
          return response.data;
      }
    };

    await playerCommand(id, command)
      .then(async (response) => {
        return await this.getPlayerState();
      })
      .catch((e) => {
        console.log(e);
        throw e;
      });
  }

  public async getShowEpisodes(id: string, offset: number, limit: number) {
    const params = new URLSearchParams();
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());
    const response: AxiosResponse<PagedList<any>> = await this.client().get(
      '/shows/' + id + '/episodes?' + params.toString(),
    );
    return response.data;
  }
  public async getSavedShows(
    offset: number,
    limit: number,
  ): Promise<PagedList<Show>> {
    const params = new URLSearchParams();
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());
    const response: AxiosResponse<PagedList<any>> = await this.client().get(
      '/profile/me/shows?' + params.toString(),
    );
    return response.data;
  }
}

export const SearchTypes: Record<string, string> = {
  Album: 'album',
  Artist: 'artist',
  Podcast: 'episode',
  Playlist: 'playlist',
  Radio: 'radio',
  Track: 'track',
};
