import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
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
    ServeStaticModule.forRoot({
      rootPath: process.env.PISTEREO_CLIENT_BASE,
      serveStaticOptions: { maxAge: 0 }
    }),
    ScheduleModule.forRoot(),
    SpotifyClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
