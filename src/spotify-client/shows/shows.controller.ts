import { AuthToken } from '@auth/auth-token.decorator';
import { Controller,Get, Param, Query } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { Spotify } from '../spotify.decorator';
import { ShowsService } from './shows.service';

@Spotify()
@ApiOAuth2(['user-read-private', 'user-read-email'], 'Api')
@Controller('/api/spotify/shows')
export class ShowsController {
  constructor(
    private readonly showsService: ShowsService,
    private readonly config: ConfigService,
  ) {}

  private readonly log = new Logger(ShowsController.name);

  @Get(':id/episodes')
  @ApiOperation({ summary: 'Get show episodes' })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  @ApiParam({ name: 'id' })
  async getShowEpisodes(
    @AuthToken() token: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
    @Param('id') id = '',
  ) {
    return await this.showsService.getShowEpisodes(token, id, offset, limit);
  }
}
