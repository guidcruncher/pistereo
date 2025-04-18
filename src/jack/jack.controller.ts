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

import { JackService } from './jack.service';
import { JackEqualiserService } from './jack-equaliser.service';

@ApiOAuth2(['streaming'], 'Api')
@Controller('/api/jack')
export class JackController {
  constructor(
    private readonly jackService: JackService,
    private readonly jackEqualiser: JackEqualiserService,
  ) {}

  @Get('equaliser')
  @ApiOperation({ summary: 'Get configured Equaliser values' })
  async getEqualiser() {
    return await this.jackEqualiser.getControls();
  }

  @Get('equaliser/:source/presets')
  @ApiOperation({ summary: 'Get configured Equaliser presets for a source' })
  @ApiParam({ name: 'source' })
  async getEqualiserPresets(@Param('source') source: string) {
    return await this.jackEqualiser.getPresets(source);
  }

  @Put('equaliser')
  @ApiOperation({ summary: 'Reset all equaliser value' })
  @ApiQuery({ name: 'level' })
  async resetEqualiser(@Query('level') level: number) {
    return await this.jackEqualiser.resetControls(level);
  }

  @Put('equaliser/:control')
  @ApiOperation({ summary: 'Set an equaliser value' })
  @ApiParam({ name: 'control' })
  @ApiQuery({ name: 'left' })
  @ApiQuery({ name: 'right' })
  async setEqualiser(
    @Param('control') index: number,
    @Query('left') left: number,
    @Query('right') right: number,
  ) {
    return await this.jackEqualiser.setControl(index, left, right);
  }

  @Put('stop')
  @ApiOperation({ summary: 'Stop all devices' })
  async stopAll() {
    return await this.jackService.stopAll();
  }

  @Put('eject')
  @ApiOperation({ summary: 'Stop and eject media from current device' })
  async eject() {
    return await this.jackService.eject();
  }

  @Put('stop/:device')
  @ApiOperation({ summary: 'Stop a given device' })
  @ApiParam({ name: 'device' })
  async stopDevice(@Param('device') device: string) {
    return await this.jackService.stopDevice(device);
  }

  @Get()
  @ApiOperation({ summary: 'Get current active device' })
  async getActive() {
    return await this.jackService.getStatus();
  }
}
