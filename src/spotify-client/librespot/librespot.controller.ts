import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiOAuth2,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

import { Play } from '../spotify-client.d';
import { LibrespotService } from './librespot.service';

@ApiOAuth2(['streaming'], 'Api')
@Controller('/api/librespot')
export class LibrespotController {
  constructor(
    private readonly librespotService: LibrespotService,
    private readonly config: ConfigService,
  ) {}

  private readonly log = new Logger(LibrespotController.name);

  @Get()
  @ApiOperation({ summary: 'Get device status' })
  async getStatus() {
    const res: any = await this.librespotService.getStatus();

    if (res) {
      return res;
    }

    throw new NotFoundException();
  }

  @Put('play')
  @ApiOperation({ summary: 'Play a Spotify track' })
  @ApiQuery({ name: 'uri', type: String, required: false, default: '' })
  @ApiQuery({ name: 'context', type: String, required: true, default: '' })
  async playAudioStream(
    @Query('uri') uri: string,
    @Query('context') context: string,
  ) {
    let req: Play = { uri: uri, skip_to_uri: '', paused: false };
    if (context && context != '') {
      req = { uri: context, skip_to_uri: uri, paused: false };
    }

    return await this.librespotService.play(req);
  }

  @Put('stop')
  @ApiOperation({ summary: 'Stop Audio track' })
  async stop() {
    return await this.librespotService.stop();
  }

  @Put('next')
  @ApiQuery({ name: 'uri', type: String, default: '' })
  @ApiOperation({ summary: 'Play next Audio track' })
  async next(@Query('uri') uri: string) {
    return await this.librespotService.next(uri);
  }

  @Put('previous')
  @ApiOperation({ summary: 'Play previous Audio track' })
  async previous() {
    return await this.librespotService.previous();
  }

  @Put('queue')
  @ApiOperation({ summary: 'Add Audio track to queue' })
  @ApiQuery({ name: 'uri', type: String, required: true, default: '' })
  async add(@Param('uri') uri: string) {
    return await this.librespotService.queue(uri);
  }

  @Put('toggleplayback')
  @ApiOperation({ summary: 'Pause / unpause playback' })
  async togglePause() {
    return await this.librespotService.playpause();
  }

  @Put('volume')
  @ApiOperation({ summary: 'Set playback volume' })
  @ApiQuery({ name: 'volume', type: Number, required: true, default: 100 })
  async setVolume(@Query('volume') volume: number) {
    return await this.librespotService.setVolume(volume, false);
  }

  @Put('mute')
  @ApiOperation({ summary: 'Mute playback volume' })
  async muteVolume() {
    return await this.librespotService.setVolume(0, false);
  }

  @Put('pause')
  @ApiOperation({ summary: 'Pause playback' })
  async pause() {
    return await this.librespotService.pause();
  }

  @Put('resume')
  @ApiOperation({ summary: 'Resume playback' })
  async resume() {
    return await this.librespotService.resume();
  }
}
