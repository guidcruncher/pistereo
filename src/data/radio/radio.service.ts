import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection } from 'mongoose';
import { RadioPreset } from '../dto/radio.dto';
import {
  EpgData,
  Epg,
  Channel,
  XmlTvRadioLink,
} from '../dto/xmltvradiolink.dto';

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
    @InjectModel(Epg.name) private epgModel: Model<Epg>,
  ) {}

  public async updateChannels(channels: Channel[]) {
    for (let i = 0; i < channels.length; i++) {
      let c = channels[i];
      await this.channelModel.findOneAndUpdate({ xmltv_id: c.xmltv_id }, c, {
        upsert: true,
      });
    }
  }

  public async getEpg(stationuuid: string) {
    let channel: Channel = (await this.getChannel(stationuuid)) as Channel;

    if (!channel) {
      return null;
    }

    let res = await this.epgModel
      .find({ xmltv_id: channel.xmltv_id })
      .lean()
      .exec();
    return res.sort((a, b) => {
      return b.stop.valueOf() - a.stop.valueOf();
    });
  }

  public async updateEpg(src: EpgData) {
    let channels: any[] = await this.xmlTvRadioLinkModel.find({}).lean().exec();
    let ch = channels
      .map((a) => {
        return a.xmltv_id;
      })
      .filter((value, index, array) => array.indexOf(value) === index);

    for (let i = 0; i < ch.length; i++) {
      let progs = src.programs.filter((p) => {
        return p.channel == ch[i];
      });
      this.logger.debug(ch[i] + ' => ' + progs.length);

      const valueOf = (a) => {
        if (!a) {
          return '';
        }
        if (a.length > 0) {
          return a[0].value;
        }
        return '';
      };
      const valueOfUrl = (a) => {
        if (!a) {
          return '';
        }
        if (a.length > 0) {
          return a[0].src;
        }
        return '';
      };
      await this.epgModel.deleteMany({ channel: channels[i].xmltv_id });
      for (let j = 0; j < progs.length; j++) {
        await this.epgModel.findOneAndUpdate(
          {
            $and: [
              { channel: channels[i].xmltv_id },
              { start: progs[j].start },
            ],
          },
          {
            channel: progs[j].channel,
            title: valueOf(progs[j].title),
            desc: valueOf(progs[j].desc),
            icon: valueOfUrl(progs[j].icon),
            start: progs[j].start,
            stop: progs[j].stop,
          },
          { upsert: true },
        );
      }
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

  public async getChannel(stationuuid: string): Promise<any> {
    let xmltvid = await this.xmlTvRadioLinkModel
      .findOne({ stationuuid: stationuuid })
      .lean()
      .exec();

    if (xmltvid) {
      return await this.channelModel
        .findOne({ xmltv_id: xmltvid.xmltv_id })
        .lean()
        .exec();
    }

    return null;
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
    let res: RadioPreset[] = (await this.radioPresetModel
      .find({ id: id })
      .sort({ name: 1 })
      .lean()
      .exec()) as RadioPreset[];

    for (let i = 0; i < res.length; i++) {
      if (res[i].image == '') {
        let ch = await this.getChannel(res[i].stationuuid);
        if (ch) {
          res[i].image = ch.icon_url;
        }
      }
    }
    return res.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
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
