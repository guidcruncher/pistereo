
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dto from '../dto';

@Injectable()
export class PlaylistService {
  constructor(private readonly config: ConfigService) {}

  private readonly log = new Logger(PlaylistService.name);

  public async getMyPlaylists
(
token: string,
    limit: number,
    offset: number,
  ) {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const result = await fetch(
      'https://api.spotify.com/v1/me/playlists?' + params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await dto.ApiResult.create(result);
  }
}


