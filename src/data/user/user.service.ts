import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection } from 'mongoose';
import { LastPlayed } from '../dto/lastplayed.dto';
import { User } from '../dto/user.dto';

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(LastPlayed.name) private lastPlayedModel: Model<LastPlayed>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  public async deleteLastPlayed() {
    return await this.lastPlayedModel.deleteMany({});
  }

  public async getLastPlayed(): Promise<LastPlayed> {
    return (await this.lastPlayedModel.findOne({}).lean().exec()) as LastPlayed;
  }

  public async getUserByName(user: string) {
    return (await this.userModel.findOne({ user: name }).lean().exec()) as User;
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
    source: string,
    uri: string,
    detail: any,
  ) {
    return new Promise((resolve, reject) => {
      let data: LastPlayed = {
        user: user,
        source: source,
        uri: uri,
        detail: detail,
      };
      this.lastPlayedModel.deleteMany({}).then(() => {
        this.lastPlayedModel
          .insertOne(data)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            this.logger.error('Error saving lastPlayed', err);
            reject(err);
          });
      });
    });
  }
}
