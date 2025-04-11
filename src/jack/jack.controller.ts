import { JackService } from './jack.service';
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
  Post,
  Session,
  Get,
  Put,
  Param,
  Query,
  Res,
  Controller,
} from '@nestjs/common';
import { Public } from '@auth/public.decorator';

@ApiOAuth2(['streaming'], 'Api')
@Controller('/api/jack')
export class JackController {
  constructor(private readonly jackService: JackService) {}

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
