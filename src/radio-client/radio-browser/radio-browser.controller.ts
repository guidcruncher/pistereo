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
import { RadioBrowserService } from './radio-browser.service';
import { Public, Private } from '@auth/public.decorator';
import { SearchRequest } from './models';
import { User } from '@auth/auth-token.decorator';

@ApiOAuth2(['streaming'], 'Api')
@Controller('/api/radio/radiobrowser/')
export class RadioBrowserController {
  constructor(private readonly radioBrowserService: RadioBrowserService) {}

  @Post('search')
  @ApiOperation({ summary: 'Performs a search' })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  async search(
    @Body() formData: SearchRequest,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return await this.radioBrowserService.search(formData, offset, limit);
  }

  @Get('/:uuid')
  @ApiOperation({ summary: 'Get a stations details' })
  @ApiParam({ name: 'uuid' })
  async getStation(@Param('uuid') uuid: string) {
    const result: any = await this.radioBrowserService.searchByUuid([uuid]);
    if (result.length > 0) {
      return result[0];
    }

    throw new NotFoundException('Station not found.');
  }

  @Get('hosts')
  @ApiOperation({ summary: 'Gets a list of available Radio Browser hosts' })
  async getHosts() {
    return await this.radioBrowserService.getHosts();
  }

  @Put('/:uuid')
  @ApiOperation({ summary: 'Listen to a station' })
  @ApiParam({ name: 'uuid' })
  async listenStation(@User() user, @Param('uuid') uuid: string) {
    return await this.radioBrowserService.streamStation(user, uuid);
  }
}
