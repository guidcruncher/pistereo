import { AuthModule } from '@auth/auth.module';
import { DataModule } from '@data/data.module';
import { Module } from '@nestjs/common';
import {APP_INTERCEPTOR } from '@nestjs/core';

import { AlbumController } from './album/album.controller';
import { AlbumService } from './album/album.service';
import { LibrespotController } from './librespot/librespot.controller';
import { LibrespotService } from './librespot/librespot.service';
import { LibrespotSocketService } from './librespot/librespot-socket.service';
import { WebhookController } from './librespot/webhook.controller';
import { PlayerController } from './player/player.controller';
import { PlayerService } from './player/player.service';
import { PlaylistController } from './playlist/playlist.controller';
import { PlaylistService } from './playlist/playlist.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { ShowsController } from './shows/shows.controller';
import { ShowsService } from './shows/shows.service';
import { SpotifyResponseInterceptor } from './spotify.decorator';

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
