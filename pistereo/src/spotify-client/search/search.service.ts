import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dto from '../dto';

@Injectable()
export class SearchService {
  constructor(private readonly config: ConfigService) {}

  private readonly log = new Logger(SearchService.name);

  public async search(
    token: string,
    q: string,
    types: string[],
    market: string,
    limit: number,
    offset: number,
  ) {
    const params = new URLSearchParams();
    params.append('q', q);
    params.append('types', types.join(','));
    params.append('market', market);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    params.append('include_external', '');

    const result = await fetch(
      'https://api.spotify.com/v1/search?' + params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await dto.ApiResult.create(result);
  }
}
