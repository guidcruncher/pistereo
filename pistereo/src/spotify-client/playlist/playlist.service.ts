import { SpotifyBaseService } from '../spotify-base.service';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PagedList } from '../spotify-client.d';

@Injectable()
export class PlaylistService extends SpotifyBaseService {
  constructor(private readonly config: ConfigService) {
    super();
  }

  private readonly log = new Logger(PlaylistService.name);

  public async getMyPlaylists(token: string, limit: number, offset: number) {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    this.log.log(this.__caller() + ' =>getMyPlaylists');
    const result = await fetch(
      'https://api.spotify.com/v1/me/playlists?' + params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await this.createPagedResponse<any>(result);
  }

  public async getPlaylistTracks(
    token: string,
    playlistId: string,
    offset: number,
    limit: number,
  ) {
    this.log.log(this.__caller() + ' =>getPlaylistTracks');
    let params = new URLSearchParams();
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());
    const result = await fetch(
      'https://api.spotify.com/v1/playlists/' +
        playlistId +
        '/tracks?' +
        params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await this.createPagedResponse<any>(result);
  }

  public async getPlaylist(token: string, playlistId: string) {
    this.log.log(this.__caller() + ' =>getPlaylist');
    const result = await fetch(
      'https://api.spotify.com/v1/playlists/' + playlistId,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await this.createPagedResponse<any>(result);
  }
}
