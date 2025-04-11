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
  Res,
  Controller,
} from '@nestjs/common';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchService } from './search.service';
import { AuthToken } from '@auth/auth-token.decorator';
import { SearchRequest } from '../spotify-client.d';

@Spotify()
@ApiOAuth2(['user-read-private', 'user-read-email'], 'Api')
@Controller('/api/spotify/search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly config: ConfigService,
  ) {}

  private readonly log = new Logger(SearchController.name);

  @Post()
  @ApiOperation({ summary: 'Performs a search' })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  async Search(
    @AuthToken() token: string,
    @Body() formData: SearchRequest,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return await this.searchService.search(
      token,
      formData.q,
      formData.types,
      formData.market,
      limit,
      offset,
    );
  }
}
