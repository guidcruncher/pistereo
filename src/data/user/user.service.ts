import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection } from 'mongoose';
import { LastPlayed } from '../dto/lastplayed.dto';
import { PlaybackHistory } from '../dto/playbackhistory.dto';
import { User } from '../dto/user.dto';

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(LastPlayed.name) private lastPlayedModel: Model<LastPlayed>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PlaybackHistory.name)
    private playbackHistoryModel: Model<PlaybackHistory>,
  ) {}

  public async deleteLastPlayed() {
    let current = await this.getLastPlayed();

    if (current) {
      let res = await this.playbackHistoryModel.findOneAndUpdate(
        { $and: [{ uri: current.uri }, { finished: { $exists: false } }] },
        { finished: new Date() },
        { upsert: false },
      );
    }
    return await this.lastPlayedModel.deleteMany({});
  }

  public async getLastPlayed(): Promise<LastPlayed> {
    return (await this.lastPlayedModel.findOne({}).lean().exec()) as LastPlayed;
  }

  public async getUserByName(user: string) {
    return (await this.userModel.findOne({ user: name }).lean().exec()) as User;
  }

  public async getUserById(id: string) {
    return (await this.userModel
      .findOne({ id: id })
      .sort({ lastAccess: -1 })
      .lean()
      .exec()) as User;
  }

  public async getUserByToken(token: string) {
    return (await this.userModel
      .findOne({ token: token })
      .lean()
      .exec()) as User;
  }

  public async deleteUserByToken(token: string) {
    return await this.userModel.deleteMany({ token: token });
  }

  public async updateUser(
    username: string,
    id: string,
    profile: any,
    token: string,
    refreshtoken: string,
  ) {
    let expires: Date = new Date();
    expires.setSeconds(expires.getSeconds() + 3600);
    let user: User = {
      user: username,
      id: id,
      profile: profile,
      token: token,
      refreshtoken: refreshtoken,
      created: new Date(),
      expires: expires,
      lastAccess: new Date(),
    };

    return await this.userModel.findOneAndUpdate({ token: token }, user, {
      upsert: true,
    });
  }

  public async updateLastAccess(token: string) {
    let lastAccess: Date = new Date();
    return await this.userModel.findOneAndUpdate(
      { token: token },
      { lastAccess: lastAccess },
      {
        upsert: false,
      },
    );
  }

  public async updateLastPlayed(
    user: string,
    display_name: string,
    source: string,
    uri: string,
    detail: any,
  ) {
    let current = await this.getLastPlayed();

    if (current && current.uri == uri) {
      return current;
    }

    let data: LastPlayed = {
      user: user,
      display_name: display_name,
      source: source,
      uri: uri,
      detail: detail,
    };

    if (display_name === '') {
      let userProfile: any = await this.getUserById(user);
      if (userProfile) {
        data.display_name = userProfile.user;
      }
    }

    await this.playbackHistoryModel.insertOne({
      user: data.user,
      display_name: data.display_name,
      source: data.source,
      uri: data.uri,
      detail: data.detail,
      created: new Date(),
    });

    await this.deleteLastPlayed();
    return await this.lastPlayedModel.insertOne(data);
  }
}
