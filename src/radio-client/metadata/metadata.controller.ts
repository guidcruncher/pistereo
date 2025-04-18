import { Public } from '@auth/public.decorator';
import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

import { MetadataService } from './metadata.service';

@Public()
@Controller('/api/radio/metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get('/icon')
  @ApiOperation({ summary: 'Get station icon' })
  @ApiQuery({ name: 'query' })
  @Header('content-type', 'image/png')
  public async getStationIcon(@Query('query') query: string) {
    return await this.metadataService.getMediaIcon(query);
  }

  @Get('/icon/url')
  @ApiOperation({ summary: 'Get station icon URL' })
  @ApiQuery({ name: 'query' })
  public async getStationIconUrl(@Query('query') query: string) {
    return await this.metadataService.getMediaIconUrl(query);
  }
}
