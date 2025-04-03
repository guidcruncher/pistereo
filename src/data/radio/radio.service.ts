import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection } from 'mongoose';
import { RadioPreset } from '../dto/radio.dto';
import { XmlTvRadioLink } from '../dto/xmltvradiolink.dto';

@Injectable()
export class RadioService {
  private logger: Logger = new Logger(RadioService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(RadioPreset.name) private radioPresetModel: Model<RadioPreset>,
    @InjectModel(XmlTvRadioLink.name)
    private xmlTvRadioLinkModel: Model<XmlTvRadioLink>,
  ) {}

  public async updateXmlTvRadioLink(xmltv_id: string, stationuuid: string) {
    return await this.xmlTvRadioLinkModel.findOneAndUpdate(
      { xmtv_id: xmltv_id },
      { xmltv_id: xmltv_id, stationuuid: stationuuid, updated: new Date() },
      {
        upsert: true,
      },
    );
  }

  public async getXmlTvStationUuid(xmltv_id: string) {
    return (await this.xmlTvRadioLinkModel
      .findOne({ xmltv_id: xmltv_id }, 'stationuuid')
      .lean()
      .exec());
  }

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
