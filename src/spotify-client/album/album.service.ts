import { SpotifyBaseService } from '../spotify-base.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiResult, Track, Album, PagedList } from '../spotify-client.d';

@Injectable()
export class AlbumService extends SpotifyBaseService {
  constructor(private readonly config: ConfigService) {
    super();
  }

  private readonly log = new Logger(AlbumService.name);

  public async getTracks(
    token: string,
    id: string,
    offset: number,
    limit: number,
  ): Promise<ApiResult<PagedList<Track>>> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    this.log.log(this.__caller() + ' =>getTracks');

    const result = await fetch(
      'https://api.spotify.com/v1/albums/' +
        id +
        '/tracks?' +
        params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await this.createPagedResponse<any>(result);
  }

  public async getNewReleases(
    token: string,
    offset: number,
    limit: number,
  ): Promise<ApiResult<PagedList<Album>>> {
    const params = new URLSearchParams();
    this.log.log(this.__caller() + ' =>getNewReleases');

    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const result = await fetch(
      'https://api.spotify.com/v1/browse/new-releases?' + params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await this.createPagedResponse<any>(result, 'albums');
  }

  public async getAlbum(token: string, id: string): Promise<ApiResult<Album>> {
    const result = await fetch('https://api.spotify.com/v1/albums/' + id, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    this.log.log(this.__caller() + ' =>getAlbum');
    return await this.createResponse<any>(result);
  }
}
