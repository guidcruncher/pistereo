import {
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
  ApiOAuth2,
} from '@nestjs/swagger';
import { Spotify } from '../spotify.decorator';
import {
  Body,
  Post,
  Session,
  Get,
  Query,
  Param,
  Res,
  Controller,
} from '@nestjs/common';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaylistService } from './playlist.service';
import { AuthToken } from '@auth/auth-token.decorator';

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
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
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
