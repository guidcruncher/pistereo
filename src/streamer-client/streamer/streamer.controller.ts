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
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StreamerService } from './streamer.service';

@ApiOAuth2(['streaming'], 'Api')
@Controller('/api/stream')
export class StreamerController {
  constructor(
    private readonly streamerService: StreamerService,
    private readonly config: ConfigService,
  ) {}

  private readonly log = new Logger(StreamerController.name);

  @Get()
  @ApiOperation({ summary: 'Get current status' })
  async getStatus() {
    return await this.streamerService.getStatus();
  }

  @Put('play')
  @ApiOperation({ summary: 'Play a Audio stream' })
  @ApiQuery({ name: 'url', type: String, required: true, default: '' })
  async playAudioStream(@Query('url') url: string) {
    return await this.streamerService.play(url);
  }

  @Put('stop')
  @ApiOperation({ summary: 'Stop Audio stream' })
  async stop() {
    return await this.streamerService.stop();
  }

  @Put('toggleplayback')
  @ApiOperation({ summary: 'Pause / unpause playback' })
  async togglePause() {
    return await this.streamerService.sendCommand('cycle', ['pause']);
  }

  @Put('volume')
  @ApiOperation({ summary: 'Set playback volume' })
  @ApiQuery({ name: 'volume', type: Number, required: true, default: 100 })
  async setVolume(@Query('volume') volume: number) {
    return await this.streamerService.sendCommand('set_property', [
      'volume',
      volume,
    ]);
  }

  @Put('mute')
  @ApiOperation({ summary: 'Mute playback volume' })
  async muteVolume() {
    return await this.streamerService.sendCommand('set_property', [
      'volume',
      0,
    ]);
  }
}
