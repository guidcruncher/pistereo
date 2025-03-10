import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SpotifyClientModule } from './spotify-client/spotify-client.module';
import configuration from './config/configuration';

@Global()
@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
