import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
  ApiOAuth2,
} from '@nestjs/swagger';
import { Spotify } from '../spotify.decorator';
import { Session, Get, Query, Res, Controller } from '@nestjs/common';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from './profile.service';
import { AuthToken } from '../auth/auth-token.decorator';
import * as dto from '../dto';

@Spotify()
@ApiOAuth2(['user-read-private', 'user-read-email'], 'Access Token')
@Controller('api/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly config: ConfigService,
  ) {}

  private readonly log = new Logger(ProfileController.name);

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile ' })
  @ApiResponse({
    status: 200,
    description: 'User profile',
    type: dto.UserProfile,
  })
  async fetchProfile(@AuthToken() token: string) {
    this.log.debug(token);
    return await this.profileService.fetchProfile(token);
  }
}
