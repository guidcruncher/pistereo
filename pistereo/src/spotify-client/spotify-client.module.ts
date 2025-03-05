import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { TokenGuard } from './auth/token.guard';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';
import { PlayerService } from './player/player.service';
import { PlayerController } from './player/player.controller';

@Module({
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
    ProfileService,
    PlayerService,
  ],
  controllers: [AuthController, ProfileController, PlayerController],
})
export class SpotifyClientModule {}
