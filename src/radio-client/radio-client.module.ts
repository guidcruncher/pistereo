import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { RadioBrowserService } from './radio-browser/radio-browser.service';
import { RadioBrowserController } from './radio-browser/radio-browser.controller';
import { StreamerService } from '../streamer-client/streamer/streamer.service';
import { DataModule } from '@data/data.module';
import { TokenGuard } from '@auth/token.guard';
import { AuthModule } from '@auth/auth.module';
import { EpgService } from './epg/epg.service';
import { EpgSchedulerService } from './epg/epg-scheduler.service';

@Module({
  providers: [
    RadioBrowserService,
    StreamerService,
    EpgService,
    EpgSchedulerService,
  ],
  controllers: [RadioBrowserController],
  imports: [AuthModule, DataModule],
  exports: [EpgSchedulerService, RadioBrowserService],
})
export class RadioClientModule {}
