import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection } from 'mongoose';
import { RadioPreset } from '../dto/radio.dto';
import { Channel, XmlTvRadioLink } from '../dto/xmltvradiolink.dto';

@Injectable()
export class RadioService {
  private logger: Logger = new Logger(RadioService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(RadioPreset.name) private radioPresetModel: Model<RadioPreset>,
    @InjectModel(XmlTvRadioLink.name)
    private xmlTvRadioLinkModel: Model<XmlTvRadioLink>,
    @InjectModel(Channel.name) private channelModel: Model<Channel>,
  ) {}

  public async updateChannels(channels: Channel[]) {
    for (let i = 0; i < channels.length; i++) {
      let c = channels[i];
      await this.channelModel.findOneAndUpdate({ xmltv_id: c.xmltv_id }, c, {
        upsert: true,
      });
    }
  }

  public async updateXmlTvRadioLink(
    xmltvid: string,
    stationuuid: string,
    name: string,
    epgname: string,
  ) {
    return await this.xmlTvRadioLinkModel.findOneAndUpdate(
      { $and: [{ xmltv_id: xmltvid }, { stationuuid: stationuuid }] },
      {
        xmltv_id: xmltvid,
        stationuuid: stationuuid,
        name: name,
        epgname: epgname,
        updated: new Date(),
      },
      {
        upsert: true,
      },
    );
  }

  public async cleanupLinks() {}

  public async getXmlTvStationUuid(xmltv_id: string) {
    return await this.xmlTvRadioLinkModel
      .find({ xmltv_id: xmltv_id }, 'stationuuid')
      .lean()
      .exec();
  }

  public async existsStationUuid(xmltv_id: string) {
    return await this.xmlTvRadioLinkModel.exists({ xmltv_id: xmltv_id });
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
