import { SpotifyBaseService } from '../spotify-base.service';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Track,
  Album,
  Show,
  Episode,
  Artist,
  ApiResult,
  PublicUser,
  PagedList,
} from '../spotify-client.d';

@Injectable()
export class ShowsService extends SpotifyBaseService {
  constructor(private readonly config: ConfigService) {
    super();
  }

  private readonly log = new Logger(ShowsService.name);

  public async getShowEpisodes(
    token: string,
    id: string,
    offset: number,
    limit: number,
  ): Promise<ApiResult<PagedList<Episode>>> {
    this.log.log(this.__caller() + ' =>getShowEpisodes');
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    const result = await fetch(
      'https://api.spotify.com/v1/shows/' +
        id +
        '/episodes?' +
        params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await this.createPagedResponse<Episode>(result);
  }
}
