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
import { MetadataService } from './metadata.service';
import { Public, Private } from '@auth/public.decorator';
import { User } from '@auth/auth-token.decorator';

@ApiOAuth2(['streaming'], 'Api')
@Controller('/api/radio/metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get('/icon')
  @ApiOperation({ summary: 'Get station icon' })
  @ApiQuery({ name: 'query' })
  public async getStationIcon(@Query('query') query: string) {
    return await this.metadataService.getMediaIconUrl(query);
  }
}
