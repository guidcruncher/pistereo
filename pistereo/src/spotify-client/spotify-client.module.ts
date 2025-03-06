import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { TokenGuard } from './auth/token.guard';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';
import { PlayerService } from './player/player.service';
import { PlayerController } from './player/player.controller';
import { SpotifyResponseInterceptor } from './spotify.decorator';
import { SearchService } from './search/search.service';
import { SearchController } from './search/search.controller';

@Module({
  providers: [
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SpotifyResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
    ProfileService,
    PlayerService,
    SearchService,
  ],
  controllers: [
    AuthController,
    ProfileController,
    PlayerController,
    SearchController,
  ],
})
export class SpotifyClientModule {}
