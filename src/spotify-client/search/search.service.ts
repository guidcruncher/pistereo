import { SpotifyBaseService } from '../spotify-base.service';
import { SearchResults } from '../spotify-client.d';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PagedList } from '../spotify-client.d';

@Injectable()
export class SearchService extends SpotifyBaseService {
  constructor(private readonly config: ConfigService) {
    super();
  }

  private readonly log = new Logger(SearchService.name);

  private normalise(inp: any): any {
    let arr: any[] = [];
    inp.items.forEach((item) => {
      arr.push(item ?? { id: '', type: '', name: '' });
    });
    inp.items = arr;
    return inp;
  }

  public async search(
    token: string,
    q: string,
    types: string[],
    market: string,
    limit: number,
    offset: number,
  ) {
    this.log.log(this.__caller() + ' =>search');
    const params = new URLSearchParams();
    params.append('q', q);
    params.append('type', types.join(','));
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

    let response: SearchResults = {} as SearchResults;
    let json: any = await result.json();

    if (json.artists) {
      response.artists = this.createPagedList<any>(
        this.normalise(json.artists),
      );
    }
    if (json.tracks) {
      response.tracks = this.createPagedList<any>(this.normalise(json.tracks));
    }
    if (json.albums) {
      response.albums = this.createPagedList<any>(this.normalise(json.albums));
    }
    if (json.playlists) {
      response.playlists = this.createPagedList<any>(
        this.normalise(json.playlists),
      );
    }
    if (json.shows) {
      response.shows = this.createPagedList<any>(this.normalise(json.shows));
    }
    if (json.episodes) {
      response.episodes = this.createPagedList<any>(
        this.normalise(json.episodes),
      );
    }

    if (json.audiobooks) {
      response.audiobooks = this.createPagedList<any>(
        this.normalise(json.audiobooks),
      );
    }

    return response;
  }
}
