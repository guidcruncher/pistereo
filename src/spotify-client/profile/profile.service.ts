import { SpotifyBaseService } from '../spotify-base.service';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Track,
  Album,
  Show,
  Artist,
  ApiResult,
  PublicUser,
  PagedList,
} from '../spotify-client.d';

@Injectable()
export class ProfileService extends SpotifyBaseService {
  constructor(private readonly config: ConfigService) {
    super();
  }

  private readonly log = new Logger(ProfileService.name);

  public async fetchMyProfile(token: string): Promise<PublicUser> {
    this.log.log(this.__caller() + ' =>fetchMyProfile');
    const result = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    return await result.json();
  }

  public async fetchProfile(
    token: string,
    userId: string,
  ): Promise<ApiResult<PublicUser>> {
    this.log.log(this.__caller() + ' =>fetchProfile');
    const result = await fetch('https://api.spotify.com/v1/users/' + userId, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    return await this.createResponse<any>(result);
  }

  public async getTopItems(
    token: string,
    itemType: string,
    offset: number,
    limit: number,
  ) {
    this.log.log(this.__caller() + ' =>getTopItems');
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    const result = await fetch(
      'https://api.spotify.com/v1/me/top/' + itemType + '?' + params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await this.createPagedResponse<any>(result);
  }

  public async getTopTracks(
    token: string,
    offset: number,
    limit: number,
  ): Promise<ApiResult<PagedList<Track>>> {
    return await this.getTopItems(token, 'tracks', offset, limit);
  }

  public async getTopArtists(
    token: string,
    offset: number,
    limit: number,
  ): Promise<ApiResult<PagedList<Artist>>> {
    return await this.getTopItems(token, 'artists', offset, limit);
  }

  public async getSavedAlbums(
    token: string,
    market: string,
    offset: number = 0,
    limit: number = 20,
  ): Promise<ApiResult<PagedList<Album>>> {
    this.log.log(this.__caller() + ' =>getSavedAlbums');
    const params = new URLSearchParams();
    if (market && market != '') {
      params.append('market', market);
    }

    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    const result = await fetch(
      'https://api.spotify.com/v1/me/albums?' + params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await this.createPagedResponse<any>(result);
  }

  public async getSavedShows(
    token: string,
    market: string,
    offset: number = 0,
    limit: number = 20,
  ): Promise<ApiResult<PagedList<Show>>> {
    this.log.log(this.__caller() + ' =>getSavedShows');
    const params = new URLSearchParams();
    if (market && market != '') {
      params.append('market', market);
    }

    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    const result = await fetch(
      'https://api.spotify.com/v1/me/shows?' + params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await this.createPagedResponse<any>(result);
  }

  public async getFollowedArtists(token: string, after: string, limit) {
    const params = new URLSearchParams();
    this.log.log(this.__caller() + ' =>getFolloedArtists');

    params.append('type', 'artist');
    if (after && after != '') {
      params.append('after', after);
    }
    params.append('limit', limit.toString());
    const result = await fetch(
      'https://api.spotify.com/v1/me/following?' + params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await this.createResponse<any>(result);
  }
}
