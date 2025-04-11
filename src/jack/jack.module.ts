import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JackController } from './jack.controller';
import { LibrespotService } from '../spotify-client/librespot/librespot.service';
import { StreamerService } from '../streamer-client/streamer/streamer.service';
import { JackService } from './jack.service';
import { DataModule } from '@data/data.module';
import { JackListenerService } from './jack-listener.service';
import { TokenGuard } from '@auth/token.guard';
import { AuthModule } from '@auth/auth.module';
import { SpotifyClientModule } from '../spotify-client/spotify-client.module';
import { StreamerClientModule } from '../streamer-client/streamer-client.module';

@Module({
  providers: [
    LibrespotService,
    StreamerService,
    JackService,
    JackListenerService,
  ],
  controllers: [JackController],
  imports: [AuthModule, DataModule, StreamerClientModule, SpotifyClientModule],
})
export class JackModule {}
