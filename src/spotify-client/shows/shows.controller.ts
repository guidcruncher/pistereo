import { PublicUser } from '../spotify-client.d';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiHeader,
  ApiOAuth2,
} from '@nestjs/swagger';
import { Spotify } from '../spotify.decorator';
import { Param, Session, Get, Query, Res, Controller } from '@nestjs/common';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShowsService } from './shows.service';
import { AuthToken } from '@auth/auth-token.decorator';

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
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
    @Param('id') id: string = '',
  ) {
    return await this.showsService.getShowEpisodes(token, id, offset, limit);
  }
}
