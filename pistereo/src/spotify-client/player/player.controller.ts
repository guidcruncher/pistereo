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

  @Put('transfer')
  @ApiOperation({ summary: 'Transfer playback to a device' })
  async transferPlayback(
    @AuthToken() token: string,
    @Body() deviceIds: string[],
  ) {
    return await this.playerService.transferPlayback(token, deviceIds);
  }
}
