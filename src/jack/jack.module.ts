import { AuthModule } from '@auth/auth.module';
import { DataModule } from '@data/data.module';
import { Module } from '@nestjs/common';

import { LibrespotService } from '../spotify-client/librespot/librespot.service';
import { SpotifyClientModule } from '../spotify-client/spotify-client.module';
import { StreamerService } from '../streamer-client/streamer/streamer.service';
import { StreamerClientModule } from '../streamer-client/streamer-client.module';
import { JackController } from './jack.controller';
import { JackService } from './jack.service';
import { JackEqualiserService } from './jack-equaliser.service';
import { JackListenerService } from './jack-listener.service';

@Module({
  providers: [
    LibrespotService,
    StreamerService,
    JackService,
    JackListenerService,
    JackEqualiserService,
  ],
  controllers: [JackController],
  imports: [AuthModule, DataModule, StreamerClientModule, SpotifyClientModule],
})
export class JackModule {}
