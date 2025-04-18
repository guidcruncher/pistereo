import { ApiProperty } from '@nestjs/swagger';

import { PagedList } from './core';

export interface SearchResults {
  tracks: PagedList<any>;
  artists: PagedList<any>;
  albums: PagedList<any>;
  playlists: PagedList<any>;
  episodes: PagedList<any>;
  shows: PagedList<any>;
  audiobooks: PagedList<any>;
}

export class SearchRequest {
  @ApiProperty()
  q: string;

  @ApiProperty({
    example: [
      'album',
      'artist',
      'playlist',
      'track',
      'show',
      'episode',
      'audiobook',
    ],
    type: Array,
    required: true,
  })
  types: string[];

  @ApiProperty()
  market: string;
}
