import { User } from '@auth/auth-token.decorator';
import {
  Controller,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { TuneinService } from './tunein.service';

@ApiOAuth2(['streaming'], 'Api')
@Controller('/api/radio/tunein')
export class TuneinController {
  constructor(private readonly tuneinService: TuneinService) {}

  @Get('/:guideid')
  @ApiOperation({ summary: 'Get station properties' })
  @ApiParam({ name: 'guideid' })
  public async getStation(@Param('guideid') guideId: string) {
    return await this.tuneinService.getStation(guideId);
  }

  @Get('/:guideid/stream')
  @ApiOperation({ summary: 'Get stream properties' })
  @ApiParam({ name: 'guideid' })
  public async getStreamUrl(@Param('guideid') guideId: string) {
    return await this.tuneinService.getStreamUrl(guideId);
  }

  @Put('/:guideid')
  @ApiOperation({ summary: 'Listen to a station' })
  @ApiParam({ name: 'guideid' })
  async listenStation(@User() user, @Param('guideid') guideid: string) {
    return await this.tuneinService.streamStation(user, guideid);
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search for a Radio station' })
  @ApiQuery({ name: 'query' })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  public async search(
    @Query('query') query: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    return await this.tuneinService.search(query, offset, limit);
  }
}
