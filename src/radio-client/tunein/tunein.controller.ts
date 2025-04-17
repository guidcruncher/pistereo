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
import {
  Body,
  Session,
  Get,
  Param,
  Put,
  Post,
  Query,
  Res,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { TuneinService } from './tunein.service';
import { Public, Private } from '@auth/public.decorator';
import { User } from '@auth/auth-token.decorator';

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
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return await this.tuneinService.search(query, offset, limit);
  }
}
