import { PublicUser } from '../spotify-client.d';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiHeader,
  ApiOAuth2,
} from '@nestjs/swagger';
import { Spotify } from '../spotify.decorator';
import { Param, Session, Get, Query, Res, Controller } from '@nestjs/common';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from './profile.service';
import { AuthToken } from '../auth/auth-token.decorator';
import * as dto from '../dto';

@Spotify()
@ApiOAuth2(['user-read-private', 'user-read-email'], 'Api')
@Controller('/api/profile')
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
    type: PublicUser,
  })
  async fetchMyProfile(@AuthToken() token: string) {
    return await this.profileService.fetchMyProfile(token);
  }

  @Get(':user_id')
  @ApiOperation({ summary: 'Get a user profile ' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'User profile',
    type: PublicUser,
  })
  async fetchProfile(
    @AuthToken() token: string,
    @Param('user_id') userId: string,
  ) {
    return await this.profileService.fetchProfile(token, userId);
  }

  @Get('me/top/artists')
  @ApiOperation({ summary: 'Get current user top artists' })
  @ApiResponse({
    status: 200,
  })
  async getTopArtistsItems(@AuthToken() token: string) {
    return await this.profileService.getTopItems(token, 'artists');
    0;
  }

  @Get('me/top/tracks')
  @ApiOperation({ summary: 'Get current user top tracks' })
  @ApiResponse({
    status: 200,
  })
  async getTopTrackItems(@AuthToken() token: string) {
    return await this.profileService.getTopItems(token, 'tracks');
  }

  @Get('me/following')
  @ApiOperation({ summary: 'Get current user followed artists' })
  @ApiQuery({ required: false, name: 'after', type: String })
  @ApiQuery({ required: true, name: 'limit', type: Number, default: 20 })
  @ApiResponse({
    status: 200,
  })
  async getFollowed(
    @AuthToken() token: string,
    @Query('after') after: string,
    @Query('limit') limit: number,
  ) {
    return await this.profileService.getFollowedArtists(token, after, limit);
  }
}
