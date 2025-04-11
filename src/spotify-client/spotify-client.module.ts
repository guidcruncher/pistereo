import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';
import { PlayerService } from './player/player.service';
import { PlayerController } from './player/player.controller';
import { SpotifyResponseInterceptor } from './spotify.decorator';
import { SearchService } from './search/search.service';
import { SearchController } from './search/search.controller';
import { PlaylistService } from './playlist/playlist.service';
import { PlaylistController } from './playlist/playlist.controller';
import { AlbumService } from './album/album.service';
import { AlbumController } from './album/album.controller';
import { LibrespotService } from './librespot/librespot.service';
import { WebhookController } from './librespot/webhook.controller';
import { LibrespotController } from './librespot/librespot.controller';
import { LibrespotSocketService } from './librespot/librespot-socket.service';
import { DataModule } from '@data/data.module';
import { TokenGuard } from '@auth/token.guard';
import { AuthModule } from '@auth/auth.module';
import { ShowsService } from './shows/shows.service';
import { ShowsController } from './shows/shows.controller';

@Module({
  imports: [AuthModule, DataModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SpotifyResponseInterceptor,
    },
    ProfileService,
    PlayerService,
    SearchService,
    PlaylistService,
    AlbumService,
    LibrespotService,
    LibrespotSocketService,
    ShowsService,
  ],
  controllers: [
    ProfileController,
    PlayerController,
    SearchController,
    PlaylistController,
    AlbumController,
    WebhookController,
    LibrespotController,
    ShowsController,
  ],
  exports: [LibrespotService],
})
export class SpotifyClientModule {}
