import { AuthToken } from '@auth/auth-token.decorator';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOAuth2, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

import { Spotify } from '../spotify.decorator';
import { AlbumService } from './album.service';

@Spotify()
@ApiOAuth2(['user-read-private', 'user-read-email'], 'Api')
@Controller('/api/spotify/albums')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly config: ConfigService,
  ) {}

  private readonly log = new Logger(AlbumController.name);

  @Get(':id')
  @ApiOperation({ summary: 'Get an album' })
  @ApiParam({ name: 'id', type: String })
  async getAlbum(@AuthToken() token: string, @Param('id') id: string) {
    return await this.albumService.getAlbum(token, id);
  }

  @Get(':id/tracks')
  @ApiOperation({ summary: 'Get an album tracks' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  async getTracks(
    @AuthToken() token: string,
    @Param('id') id: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    return await this.albumService.getTracks(token, id, offset, limit);
  }

  @Get('new-releases')
  @ApiOperation({ summary: 'Get album new releases' })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  async getNewReleases(
    @AuthToken() token: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    return await this.albumService.getNewReleases(token, offset, limit);
  }
}
