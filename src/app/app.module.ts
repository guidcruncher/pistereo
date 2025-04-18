import { AuthModule } from '@auth/auth.module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import configuration from '../config/configuration';
import { DataModule } from '../data/data.module';
import { JackModule } from '../jack/jack.module';
import { JackService } from '../jack/jack.service';
import { EpgService } from '../radio-client/epg/epg.service';
import { RadioClientModule } from '../radio-client/radio-client.module';
import { SpotifyClientModule } from '../spotify-client/spotify-client.module';
import { StreamerClientModule } from '../streamer-client/streamer-client.module';
import { AppService } from './app.service';
import { ContentModule } from './content/content.module';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';

@Global()
@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('host.mongo.url'),
        dbName: config.get('host.mongo.database') ?? 'pistereo',
      }),
    }),
    ScheduleModule.forRoot(),
    SpotifyClientModule,
    StreamerClientModule,
    JackModule,
    RadioClientModule,
    DataModule,
    AuthModule,
    ContentModule.forRootAsync(),
  ],
  controllers: [SchedulerController],
  providers: [AppService, JackService, EpgService, SchedulerService],
})
export class AppModule {}
