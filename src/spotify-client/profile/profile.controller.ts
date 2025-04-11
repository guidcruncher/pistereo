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
import { AuthToken } from '@auth/auth-token.decorator';

@Spotify()
@ApiOAuth2(['user-read-private', 'user-read-email'], 'Api')
@Controller('/api/spotify/profile')
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
  })
  async fetchProfile(
    @AuthToken() token: string,
    @Param('user_id') userId: string,
  ) {
    return await this.profileService.fetchProfile(token, userId);
  }

  @Get('me/top/artists')
  @ApiOperation({ summary: 'Get current user top artists' })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  @ApiResponse({
    status: 200,
  })
  async getTopArtistsItems(
    @AuthToken() token: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return await this.profileService.getTopArtists(token, offset, limit);
  }

  @Get('me/top/tracks')
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  @ApiOperation({ summary: 'Get current user top tracks' })
  @ApiResponse({
    status: 200,
  })
  async getTopTrackItems(
    @AuthToken() token: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return await this.profileService.getTopTracks(token, offset, limit);
  }

  @Get('me/albums')
  @ApiOperation({ summary: 'Get user saved albums' })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  @ApiQuery({ name: 'market', type: String, required: false, default: '' })
  async getSavedAlbums(
    @AuthToken() token: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
    @Query('market') market: string = '',
  ) {
    return await this.profileService.getSavedAlbums(
      token,
      market,
      offset,
      limit,
    );
  }

  @Get('me/shows')
  @ApiOperation({ summary: 'Get user saved shows' })
  @ApiQuery({ name: 'limit', type: Number, required: true, default: 20 })
  @ApiQuery({ name: 'offset', type: Number, required: true, default: 0 })
  @ApiQuery({ name: 'market', type: String, required: false, default: '' })
  async getSavedShows(
    @AuthToken() token: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
    @Query('market') market: string = '',
  ) {
    return await this.profileService.getSavedShows(
      token,
      market,
      offset,
      limit,
    );
  }

  @Get('me/following')
  @ApiOperation({ summary: 'Get current user followed artists' })
  @ApiQuery({
    required: true,
    default: '012XqVXqHSCXjHhk6AYYRe',
    name: 'after',
    type: String,
  })
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
