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
  Put,
  Post,
  Query,
  Res,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlayerService } from './player.service';
import { AuthToken } from '@auth/auth-token.decorator';
import { Public } from '@auth/public.decorator';
import { Spotify } from '../spotify.decorator';
import {
  DeviceTransferRequest,
  PlaybackRequest,
  DefaultPlaybackRequest,
} from '../spotify-client.d';

@Spotify()
@ApiOAuth2(
  [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-recently-played',
  ],
  'Api',
)
@Controller('/api/spotify/player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly config: ConfigService,
  ) {}

  private readonly log = new Logger(PlayerController.name);

  @Get()
  @ApiOperation({ summary: 'Get current playback state' })
  @ApiResponse({
    status: 200,
    description: 'Playback state',
  })
  async getPlaybackState(@AuthToken() token: string) {
    return await this.playerService.getPlaybackState(token);
  }

  @Put()
  @ApiOperation({ summary: 'Transfer playback to a device' })
  async transferPlayback(
    @AuthToken() token: string,
    @Body() formData: DeviceTransferRequest,
  ) {
    return await this.playerService.transferPlayback(
      token,
      formData.device_ids,
      formData.play,
    );
  }

  @Put('default')
  @ApiOperation({
    summary: 'Transfer playback to default configured playback device.',
  })
  async transferPlaybackToDefault(
    @AuthToken() token: string,
    @Query('play') play: boolean,
  ) {
    let result: any = await this.playerService.getAvailableDevices(token);
    let deviceName = this.config.get('spotify.playbackdevice');

    if (result.status == 200 && result.result.devices) {
      let defaultDevice: any = result.result.devices.find((d) => {
        return d.name == deviceName;
      });

      if (!defaultDevice) {
        throw new NotFoundException(
          "Default device '" + deviceName + "' not found.",
        );
      }

      return await this.playerService.transferPlayback(
        token,
        [defaultDevice.id],
        play,
      );
    }

    throw new NotFoundException(
      "Default device '" + deviceName + "' not found.",
    );
  }

  @Get('devices')
  @ApiOperation({ summary: 'Get available playback devices' })
  async getAvailableDevices(@AuthToken() token: string) {
    return await this.playerService.getAvailableDevices(token);
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default configured playback device' })
  async getDefaultDevice(@AuthToken() token: string) {
    let result: any = await this.playerService.getAvailableDevices(token);
    let deviceName = this.config.get('spotify.playbackdevice');
    if (result.status == 200 && result.result.devices) {
      let defaultDevice: any = result.result.devices.find((d) => {
        return d.name == deviceName;
      });

      if (!defaultDevice) {
        throw new NotFoundException(
          "Default device '" + deviceName + "' not found.",
        );
      }

      return defaultDevice;
    }

    throw new NotFoundException(
      "Default device '" + deviceName + "' not found.",
    );
  }

  @Get('currently-playing')
  @ApiOperation({ summary: 'Get current playing track' })
  async getCurrentPlayingTrack(@AuthToken() token: string) {
    return await this.playerService.getCurrentPlayingTrack(token);
  }

  @Get('queue')
  @ApiOperation({ summary: 'Get playback queue' })
  async getPlaybackQueue(@AuthToken() token: string) {
    return await this.playerService.getPlaybackQueue(token);
  }

  @Post('queue')
  @ApiOperation({ summary: 'Append to end of playback queue' })
  async addToPlaybackQueue(
    @AuthToken() token: string,
    @Query('uri') uri: string,
    @Query('device_id') deviceId: string,
  ) {
    return await this.playerService.addToPlaybackQueue(token, uri, deviceId);
  }

  @Put('play')
  @ApiOperation({ summary: 'Start playback on a device' })
  async startResumePlayback(
    @AuthToken() token: string,
    @Body() formData: PlaybackRequest,
  ) {
    return await this.playerService.startResumePlayback(
      token,
      formData.deviceId,
      formData.contextUri,
      formData.uris,
      formData.positionMs,
    );
  }

  @Put('default/play')
  @ApiOperation({ summary: 'Start playback on default configured device' })
  async startResumePlaybackOnDefault(
    @AuthToken() token: string,
    @Body() formData: DefaultPlaybackRequest,
  ) {
    let result: any = await this.playerService.getAvailableDevices(token);
    let deviceName = this.config.get('spotify.playbackdevice');
    if (result.status == 200 && result.result.devices) {
      let defaultDevice: any = result.result.devices.find((d) => {
        return d.name == deviceName;
      });
      if (!defaultDevice) {
        throw new NotFoundException(
          "Default device '" + deviceName + "' not found.",
        );
      }

      return await this.playerService.startResumePlayback(
        token,
        defaultDevice.id,
        formData.contextUri,
        formData.uris,
        formData.positionMs,
      );
    }

    throw new NotFoundException(
      "Default device '" + deviceName + "' not found.",
    );
  }

  @Put('volume')
  @ApiOperation({ summary: 'Set playback volume' })
  async setPlaybackVolume(
    @AuthToken() token: string,
    @Query('device_id') deviceId: string,
    @Query('volume_percent') level: number,
  ) {
    return await this.playerService.setPlaybackVolume(token, deviceId, level);
  }

  @Put('default/volume')
  @ApiOperation({ summary: 'Set playback volume on default configured device' })
  async setPlaybackVolumeOnDefault(
    @AuthToken() token: string,
    @Query('volume_percent') level: number,
  ) {
    let result: any = await this.playerService.getAvailableDevices(token);
    let deviceName = this.config.get('spotify.playbackdevice');

    if (result.status == 200 && result.result.devices) {
      let defaultDevice: any = result.result.devices.find((d) => {
        return d.name == deviceName;
      });

      if (!defaultDevice) {
        throw new NotFoundException(
          "Default device '" + deviceName + "' not found.",
        );
      }

      return await this.playerService.setPlaybackVolume(
        token,
        defaultDevice.id,
        level,
      );
    }

    throw new NotFoundException(
      "Default device '" + deviceName + "' not found.",
    );
  }

  @Post('next')
  @ApiOperation({ summary: 'Skip to next track' })
  async skipNext(
    @AuthToken() token: string,
    @Query('device_id') deviceId: string,
  ) {
    return await this.playerService.skipNext(token, deviceId);
  }

  @Post('previous')
  @ApiOperation({ summary: 'Skip back to previous track' })
  async skipPrevious(
    @AuthToken() token: string,
    @Query('device_id') deviceId: string,
  ) {
    return await this.playerService.skipPrevious(token, deviceId);
  }

  @Put('pause')
  @ApiOperation({ summary: 'Pause playback' })
  async pause(
    @AuthToken() token: string,
    @Query('device_id') deviceId: string,
  ) {
    return await this.playerService.pause(token, deviceId);
  }

  @Put('stop')
  @ApiOperation({ summary: 'Stop playback' })
  async stop(@AuthToken() token: string, @Query('device_id') deviceId: string) {
    return await this.playerService.stop(token, deviceId);
  }

  @Public()
  @Get('web-player')
  @ApiQuery({ name: 'access_token', required: false })
  @ApiOperation({
    summary: 'Returns an embedded page with a HTML player inside it ',
  })
  async getWebPlayer(
    @Session() session,
    @AuthToken() accessToken: string,
    @Query('access_token') token,
    @Res() res,
  ) {
    let html = await this.playerService.getWebPlayer(
      token ?? accessToken ?? session.get('access_token') ?? '',
    );

    if (html == '') {
      res.status(404).send();
    } else {
      res.status(200).type('text/html').send(html);
    }
  }

  @Get('recently-played')
  @ApiOperation({ summary: 'Get recently played  tracks' })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'after', type: Number, required: false })
  @ApiQuery({ name: 'before', type: Number, required: false })
  async getRecentlyPlayed(
    @AuthToken() token: string,
    @Query('limit') limit: number = 20,
    @Query('after') after: number = 0,
    @Query('before') before: number = 0,
  ) {
    return await this.playerService.getRecentlyPlayed(
      token,
      limit,
      after,
      before,
    );
  }
}
