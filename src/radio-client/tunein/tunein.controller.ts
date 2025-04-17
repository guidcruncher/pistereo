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
@Controller('/api/tunein')
export class TuneinController {
  constructor(private readonly tuneinService: TuneinService) {}

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
