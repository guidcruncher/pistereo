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
import { Public, Private } from '@auth/public.decorator';
import { User } from '@auth/auth-token.decorator';
import { EpgService } from './epg/epg.service';

@ApiOAuth2(['streaming'], 'Api')
@Controller('/api/radio/')
export class RadioController {
  constructor(private readonly epgService: EpgService) {}

  @Get('epg')
  @ApiOperation({ summary: 'Get a channels EPG' })
  @ApiQuery({ name: 'xmltvid' })
  async getEpgForChannel(@Query('xmltvid') xmltvid: string) {
    const res = await this.epgService.getEpgForChannel(xmltvid);

    if (res == null) {
      throw new NotFoundException();
    }

    return res;
  }

  @Put('/presets/:uuid')
  @ApiOperation({ summary: 'Save a station preset' })
  @ApiParam({ name: 'uuid' })
  async savePreset(@Param('uuid') uuid: string, @User() user) {}

  @Get('/presets')
  @ApiOperation({ summary: 'Get station presets' })
  async getPresets(@User() user) {}
}
