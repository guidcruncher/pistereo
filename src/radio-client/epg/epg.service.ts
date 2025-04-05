import {
  lookupLanguage,
  Station,
  PagedList,
  SearchRequest,
} from '../radio-browser/models';
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
    let xmltvchannels: any = this.config.get<string>('radio.xmltvchannels');
    const result = await fetch(xmltvchannels, {
      method: 'GET',
    });

    let c: any = (await result.json()).channels as Channel[];
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
    await this.downloadEpg();
    let channels: Channel[] = await this.getChannels();
    await this.radioService.updateChannels(channels);
    await this.radioService.cleanupLinks();
  }

  public async executeScheduleJobWithStationCheck() {
    await this.downloadEpg();
    let channels: Channel[] = await this.getChannels();
    await this.radioService.updateChannels(channels);
    let ch = channels.reverse();

    for (let i = 0; i < ch.length; i++) {
      let c = ch[i];
      let stationuuidexists = await this.radioService.existsStationUuid(
        c.xmltv_id,
      );
      if (!stationuuidexists) {
        let query: SearchRequest = new SearchRequest();
        query.language = c.lang;
        query.name = c.name;
        query.nameExact = true;
        let res: Station[] = await this.radioBrowserService.search(
          query,
          0,
          50,
        );
        if (res && res.length > 0) {
          await res.forEach(async (r) => {
            if (c.name == r.name) {
              await this.radioService.updateXmlTvRadioLink(
                c.xmltv_id,
                r.stationuuid,
                r.name,
                c.name,
              );
            }
          });
        }
        await this.randomWait();
      }

      await this.radioService.cleanupLinks();
    }
  }

  public async downloadEpg() {
    let xmltvurl: any = this.config.get<string>('radio.xmltvurl');
    let localFilename = path.join(process.env.APPCACHE as string, 'epg.xml');
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
    let parsed = parser.parse(xml);
    await this.radioService.updateEpg(parsed);
  }

  public async getEpgForChannel(stationuuid: string) {
    return await this.radioService.getEpg(stationuuid);
  }
}
