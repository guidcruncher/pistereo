import { AuthToken } from '@auth/auth-token.decorator';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOAuth2, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

import { Spotify } from '../spotify.decorator';
import { PlaylistService } from './playlist.service';

@Spotify()
@ApiOAuth2(['playlist-read-private'], 'Api')
@Controller('/api/spotify/playlists')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly config: ConfigService,
  ) {}

  private readonly log = new Logger(PlaylistController.name);

  @Get()
  @ApiOperation({ summary: 'Get user playlists' })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  async getMyPlaylists(
    @AuthToken() token: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    return await this.playlistService.getMyPlaylists(token, limit, offset);
  }

  @Get(':playlist_id')
  @ApiOperation({ summary: 'Get playlist details' })
  @ApiParam({ name: 'playlist_id', type: String })
  async getPlaylist(
    @AuthToken() token,
    @Param('playlist_id') playlistId: string,
  ) {
    return await this.playlistService.getPlaylist(token, playlistId);
  }

  @Get(':playlist_id/tracks')
  @ApiOperation({ summary: 'Get playlist tracks' })
  @ApiParam({ name: 'playlist_id', type: String })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 100 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  async getPlaylistTracks(
    @AuthToken() token,
    @Param('playlist_id') playlistId: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.playlistService.getPlaylistTracks(
      token,
      playlistId,
      offset,
      limit,
    );
  }
}
