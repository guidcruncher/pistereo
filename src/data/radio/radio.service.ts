import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection } from 'mongoose';
import { RadioPreset } from '../dto/radio.dto';

@Injectable()
export class RadioService {
  private logger: Logger = new Logger(RadioService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(RadioPreset.name) private radioPresetModel: Model<RadioPreset>,
  ) {}

  public async getPresets(id: string): Promise<RadioPreset[]> {
    return (await this.radioPresetModel
      .find({ id: id })
      .sort({ name: 1 })
      .lean()
      .exec()) as RadioPreset[];
  }

  public async savePreset(preset: RadioPreset) {
    return await this.radioPresetModel.findOneAndUpdate(
      { $and: [{ id: preset.id }, { stationuuid: preset.stationuuid }] },
      preset,
      {
        upsert: true,
      },
    );
  }
}
