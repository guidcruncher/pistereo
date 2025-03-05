import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
  ApiOAuth2,
} from '@nestjs/swagger';
import { Session, Get, Query, Res, Controller } from '@nestjs/common';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlayerService } from './player.service';
import { AuthToken } from '../auth/auth-token.decorator';
import * as dto from '../dto';

@ApiOAuth2(['user-read-playback-state', 'user-modify-playback-state'])
@Controller('api/player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly config: ConfigService,
  ) {}

  private readonly log = new Logger(PlayerController.name);
}
