import {
  lookupLanguage,
  PagedList,
  SearchRequest,
} from '../radio-browser/models';
import { Station } from '@data/dto';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel } from '@data/dto/xmltvradiolink.dto';
import parser from 'epg-parser';
import * as path from 'path';
import * as fs from 'fs';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RadioService } from '@data/radio/radio.service';
import { RadioBrowserService } from '../radio-browser/radio-browser.service';

@Injectable()
export class EpgService {
  constructor(
    private readonly config: ConfigService,
    private readonly radioService: RadioService,
    private readonly radioBrowserService: RadioBrowserService,
  ) {}

  private readonly log = new Logger(EpgService.name);

  public async getChannels(): Promise<Channel[]> {
    const xmltvchannels: any = this.config.get<string>('radio.xmltvchannels');
    const result = await fetch(xmltvchannels, {
      method: 'GET',
    });

    const c: any = (await result.json()).channels as Channel[];
    this.log.debug('Found ' + c.length.toString() + ' channels');
    return c;
  }

  async randomWait() {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 100)),
    );
    return;
  }

  public async executeScheduleJob() {
    const channels: Channel[] = await this.getChannels();
    await this.radioService.updateChannels(channels);
    await this.radioService.cleanupLinks();
    await this.downloadEpg();
  }

  private loadMappings(): any {
    const filename = path.join(
      process.env.NODE_CONFIG_DIR as string,
      'stationmappings.json',
    );
    if (fs.existsSync(filename)) {
      const txt: string = fs.readFileSync(filename, 'utf8');
      return JSON.parse(txt);
    }
    return {};
  }

  public async executeScheduleJobWithStationCheck() {
    const mappings: any = this.loadMappings();
    const channels: Channel[] = await this.getChannels();
    await this.radioService.updateChannels(channels);
    const ch = channels.reverse();

    const stationCheck = (channel, station) => {
      if (channel == station) {
        return true;
      }
      const map = mappings[channel] ?? [];
      for (let i = 0; i < map.length; i++) {
        if (map[i] == station) {
          return true;
        }
        const r = new RegExp(
          '\b' + map[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\b',
        );
        if (r.test(station)) {
          return true;
        }
      }
      return false;
    };

    for (let i = 0; i < ch.length; i++) {
      const c = ch[i];
      const stationuuidexists = await this.radioService.existsStationUuid(
        c.xmltv_id,
      );
      if (!stationuuidexists) {
        const query: SearchRequest = new SearchRequest();
        // query.language = c.lang;
        query.name = c.name;
        query.nameExact = true;
        const res: Station[] = await this.radioBrowserService.search(
          query,
          0,
          50,
        );
        if (res && res.length > 0) {
          await res.forEach(async (r) => {
            if (stationCheck(c.name, r.name)) {
              await this.radioService.updateXmlTvRadioLink(
                c.xmltv_id,
                r.stationuuid,
                r.name,
                c.name,
                true,
              );
            }
          });
        }
        await this.randomWait();
      }

      await this.radioService.cleanupLinks();
      await this.downloadEpg();
    }
  }

  public async downloadEpg() {
    const xmltvurl: any = this.config.get<string>('radio.xmltvurl');
    const localFilename = path.join(process.env.APPCACHE as string, 'epg.xml');
    let xml: any = '';
    const result = await fetch(xmltvurl, {
      method: 'GET',
    });
    xml = await result.text();

    if (fs.existsSync(localFilename)) {
      if (fs.existsSync(localFilename + '.bak')) {
        fs.unlinkSync(localFilename + '.bak');
      }
      fs.copyFileSync(localFilename, localFilename + '.bak');
    }
    fs.writeFileSync(localFilename, xml);
    const parsed = parser.parse(xml);
    await this.radioService.updateEpg(parsed);
  }

  private formatTinyDate(dateString) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
    };
    const dateTimeFormat = new Intl.DateTimeFormat('default', options);
    return dateTimeFormat.format(date);
  }

  public async getEpgForChannel(stationuuid: string) {
    const epg: any[] = await this.radioService.getEpg(stationuuid);
    if (epg) {
      for (let i = 0; i < epg.length; i++) {
        epg[i].sameDay =
          this.formatTinyDate(epg[i].start) == this.formatTinyDate(epg[i].stop);
      }
    }

    return epg;
  }
}
