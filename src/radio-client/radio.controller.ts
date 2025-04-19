import { User } from '@auth/auth-token.decorator';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { EpgService } from './epg/epg.service';
import { RadioService } from './radio.service';
    
@ApiOAuth2(['streaming'], 'Api')
@Controller('/api/radio/')
export class RadioController {
  constructor(
    private readonly epgService: EpgService,
    private readonly radioService: RadioService,
  ) {}

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

  @Put('play/:uuid')
  @ApiOperation({ summary: 'Play a stream' })
  @ApiParam({ name: 'uuid' })
  async playStation(@Param('uuid') uuid: string, @User() user) {
    return await this.radioService.playStation(uuid, user);
  }

  @Get('station/:uuid')
  @ApiOperation({ summary: 'Get a stream' })
  @ApiParam({ name: 'uuid' })
  async getStation(@Param('uuid') uuid: string, @User() user) {
    return await this.radioService.getStation(uuid);
  }

  @Put('presets/:uuid')
  @ApiOperation({ summary: 'Save a station preset' })
  @ApiParam({ name: 'uuid' })
  async savePreset(@Param('uuid') uuid: string, @User() user) {
    return await this.radioService.savePreset(uuid, user);
  }

  @Get('/presets')
  @ApiOperation({ summary: 'Get station presets' })
  async getPresets(@User() user) {
    return await this.radioService.getPresets(user);
  }

  @Put('playlist/import')
  @ApiOperation({
    summary: 'Import a M3U playlist into a set of custom stations',
  })
  @ApiConsumes('text/plain')
  @ApiBody({ type: String })
  async importPlaylist(@User() user, @Req() req) {
    return await this.radioService.importPlaylist(user, req.body as string);
  }
}
