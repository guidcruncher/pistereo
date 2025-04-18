import * as dto from '@data/dto';
import { Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';




const mongoose = require('mongoose');

@Injectable()
export class MongoConnectionService {
  constructor(
    private configService: ConfigService,
    @InjectConnection() private connection: Connection,
  ) {}

  public static setup() {
    return MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('host.mongo.url'),
        dbName: config.get('host.mongo.database') ?? 'pistereo',
      }),
    });
  }

  async transaction<T>(cb: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const result = await cb(session);
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async getSession(): Promise<ClientSession> {
    return await this.connection.startSession();
  }

  public static getSchemas() {
    return MongooseModule.forFeature([
      { name: dto.LastPlayed.name, schema: dto.LastPlayedSchema },
      { name: dto.User.name, schema: dto.UserSchema },
      { name: dto.RadioPreset.name, schema: dto.RadioPresetSchema },
      { name: dto.XmlTvRadioLink.name, schema: dto.XmlTvRadioLinkSchema },
      { name: dto.Channel.name, schema: dto.ChannelSchema },
      { name: dto.Epg.name, schema: dto.EpgSchema },
      { name: dto.Stream.name, schema: dto.StreamSchema },
      { name: dto.PlaybackHistory.name, schema: dto.PlaybackHistorySchema },
    ]);
  }
}
