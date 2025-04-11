import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { SpotifyClientModule } from '../spotify-client/spotify-client.module';
import configuration from '../config/configuration';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StreamerClientModule } from '../streamer-client/streamer-client.module';
import { JackModule } from '../jack/jack.module';
import { RadioClientModule } from '../radio-client/radio-client.module';
import { EpgService } from '../radio-client/epg/epg.service';
import { DataModule } from '../data/data.module';
import { AuthModule } from '@auth/auth.module';
import { JackService } from '../jack/jack.service';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { ContentModule } from './content/content.module';

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
