import { AuthModule } from '@auth/auth.module';
import { DataModule } from '@data/data.module';
import { Module } from '@nestjs/common';

import { StreamerService } from '../streamer-client/streamer/streamer.service';
import { EpgService } from './epg/epg.service';
import { EpgSchedulerService } from './epg/epg-scheduler.service';
import { MetadataController } from './metadata/metadata.controller';
import { MetadataService } from './metadata/metadata.service';
import { RadioController } from './radio.controller';
import { RadioService } from './radio.service';
import { RadioBrowserController } from './radio-browser/radio-browser.controller';
import { RadioBrowserService } from './radio-browser/radio-browser.service';
import { TuneinController } from './tunein/tunein.controller';
import { TuneinService } from './tunein/tunein.service';

@Module({
  providers: [
    RadioBrowserService,
    StreamerService,
    EpgService,
    EpgSchedulerService,
    TuneinService,
    RadioService,
    MetadataService,
  ],
  controllers: [
    RadioBrowserController,
    TuneinController,
    RadioController,
    MetadataController,
  ],
  imports: [AuthModule, DataModule],
  exports: [EpgSchedulerService, RadioBrowserService],
})
export class RadioClientModule {}
