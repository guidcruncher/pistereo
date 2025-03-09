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
} from '@nestjs/common';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlayerService } from './player.service';
import { AuthToken } from '../auth/auth-token.decorator';
import { Public } from '../auth/public.decorator';
import * as dto from '../dto';
import { Spotify } from '../spotify.decorator';

@Spotify()
@ApiOAuth2(
  [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-recently-played',
  ],
  'Access Token',
)
@Controller('/api/player')
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
    @Body() formData: dto.PlaybackRequest,
  ) {
    return await this.playerService.startResumePlayback(
      token,
      formData.deviceId,
      formData.contextUri,
      formData.uris,
      formData.positionMs,
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

  @Put('next')
  @ApiOperation({ summary: 'Skip to next track' })
  async skipNext(
    @AuthToken() token: string,
    @Query('device_id') deviceId: string,
  ) {
    return await this.playerService.skipNext(token, deviceId);
  }

  @Put('previous')
  @ApiOperation({ summary: 'Skip back to previous track' })
  async skipPrevious(
    @AuthToken() token: string,
    @Query('device_id') deviceId: string,
  ) {
    return await this.playerService.skipPrevious(token, deviceId);
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
