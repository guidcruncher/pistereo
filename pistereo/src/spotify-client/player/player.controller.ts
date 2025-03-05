import {
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
} from '@nestjs/common';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlayerService } from './player.service';
import { AuthToken } from '../auth/auth-token.decorator';
import * as dto from '../dto';
import { Spotify } from '../spotify.decorator';

@Spotify()
@ApiOAuth2(
  ['user-read-playback-state', 'user-modify-playback-state'],
  'Access Token',
)
@Controller('api/player')
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
    @Body() deviceIds: string[],
  ) {
    return await this.playerService.transferPlayback(token, deviceIds);
  }

  @Get('devices')
  @ApiOperation({ summary: 'Get available playback devices' })
  async getAvailableDevices(@AuthToken() token: string) {
    return await this.playerService.getAvailableDevices(token);
  }

  @Get('current-playing')
  @ApiOperation({ summary: 'Get current playing track' })
  async getCurrentPlayingTrack(@AuthToken() token: string) {
    return await this.playerService.getCurrentPlayingTrack(token);
  }

  @Put('play')
  @ApiOperation({ summary: 'Start playback on a device' })
  async startResumePlayback(
    @AuthToken() token: string,
    @Body() formData: dto.PlaybackRequest,
  ) {
    return await this.playerService.startResumePlayback(
      token,
      formData.deviceId,
      formData.contextUri,
      formData.positionMs,
    );
  }

  @Put('volume')
  @ApiOperation({ summary: 'Set playback volume' })
  async setPlaybackVolume(
    @AuthToken() token: string,
    deviceId: string,
    level: number,
  ) {
    return await this.playerService.setPlaybackVolume(token, deviceId, level);
  }

  @Put('next')
  @ApiOperation({ summary: 'Skip to next track' })
  async skipNext(@AuthToken() token: string, deviceId: string) {
    return await this.playerService.skipNext(token, deviceId);
  }

  @Put('previous')
  @ApiOperation({ summary: 'Skip havk to previous track' })
  async skipPrevious(@AuthToken() token: string, deviceId: string) {
    return await this.playerService.skipPrevious(token, deviceId);
  }
}
