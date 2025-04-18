import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connection } from 'mongoose';

import {
  Channel,
  Epg,
  EpgData,
  RadioPreset,
  Stream,
  XmlTvRadioLink,
} from '../dto';

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
    @InjectModel(Stream.name) private streamModel: Model<Stream>,
  ) {}

  public async updateChannels(channels: Channel[]) {
    for (let i = 0; i < channels.length; i++) {
      const c = channels[i];
      await this.channelModel.findOneAndUpdate({ xmltv_id: c.xmltv_id }, c, {
        upsert: true,
      });
    }
  }

  private toUTC(date: Date) {
    const utc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    );
    return utc;
  }

  public async getEpg(xmltv_id: string) {
    const res = await this.epgModel.find({ channel: xmltv_id }).lean().exec();
    const now = this.toUTC(new Date());
    return res
      .filter((a) => {
        return this.toUTC(a.stop) >= now;
      })
      .sort((a, b) => {
        return a.stop.valueOf() - b.stop.valueOf();
      });
  }

  public async updateEpg(src: EpgData) {
    const channels: any[] = await this.xmlTvRadioLinkModel
      .find({})
      .lean()
      .exec();
    await this.epgModel.deleteMany({});

    const ch = channels
      .map((a) => {
        return a.xmltv_id;
      })
      .filter((value, index, array) => array.indexOf(value) === index);

    for (let i = 0; i < ch.length; i++) {
      const progs = src.programs.filter((p) => {
        return p.channel == ch[i];
      });
      this.logger.log(
        'Updated ' + ch[i] + ' EPG with ' + progs.length + ' items.',
      );

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
      for (let j = 0; j < progs.length; j++) {
        await this.epgModel.insertOne({
          channel: progs[j].channel,
          title: valueOf(progs[j].title),
          desc: valueOf(progs[j].desc),
          icon: valueOfUrl(progs[j].icon),
          start: progs[j].start,
          stop: progs[j].stop,
        });
      }
    }
  }

  public async getStreams(uuid: string[]) {
    const res = await this.streamModel
      .find({ stationuuid: { $in: uuid } })
      .lean();

    return res;
  }

  public async getStreamsByName(name: string, offset: number, limit: number) {
    const res = await this.streamModel
      .find({ name: { $regex: '.*' + name + '.*' } })
      .sort('name')
      .lean();

    if (offset > res.length) {
      return [];
    }

    return res.slice(offset, offset + limit);
  }

  public async getStream(stationuuid: string) {
    const res = await this.streamModel
      .findOne({ stationuuid: stationuuid })
      .lean()
      .exec();

    return res;
  }

  public async updateStream(
    stationuuid: string,
    name: string,
    resolvedurl: string,
    favicon: string,
    database: string,
  ) {
    return await this.streamModel.findOneAndUpdate(
      { stationuuid: stationuuid },
      {
        stationuuid: stationuuid,
        name: name,
        url_resolved: resolvedurl,
        database: database,
        favicon: favicon,
      },
      {
        upsert: true,
      },
    );
  }

  public async updateXmlTvRadioLink(
    xmltvid: string,
    stationuuid: string,
    name: string,
    epgname: string,
    automap = true,
  ) {
    return await this.xmlTvRadioLinkModel.findOneAndUpdate(
      { $and: [{ xmltv_id: xmltvid }, { stationuuid: stationuuid }] },
      {
        xmltv_id: xmltvid,
        stationuuid: stationuuid,
        name: name,
        epgname: epgname,
        automap: automap,
        updated: new Date(),
      },
      {
        upsert: true,
      },
    );
  }

  public async getChannel(stationuuid: string): Promise<any> {
    const xmltvid = await this.xmlTvRadioLinkModel
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
    const res: RadioPreset[] = (await this.radioPresetModel
      .find({ id: id })
      .sort({ name: 1 })
      .lean()
      .exec()) as RadioPreset[];

    for (let i = 0; i < res.length; i++) {
      if (res[i].image == '') {
        const ch = await this.getChannel(res[i].stationuuid);
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
