import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel } from '@data/dto/xmltvradiolink.dto';
import { parseXmltv, writeXmltv, parser } from '@iptv/xmltv';
import * as path from 'path';
import * as fs from 'fs';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class EpgService {
  constructor(private readonly config: ConfigService) {}

  private readonly log = new Logger(EpgService.name);

  public async getChannels(): Promise<Channel[]> {
    let xmltvchannels: any = this.config.get<string>('radio.xmltvchannels');
    const result = await fetch(xmltvchannels, {
      method: 'GET',
    });

    return (await result.json()) as Channel[];
  }

  public async downloadEpg() {
    let xmltvurl: any = this.config.get<string>('radio.xmltvurl');
    let localFilename = path.join(process.env.APPCACHE, 'epg.xml');
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
  }

  public async getEpg(useCache: boolean = true) {
    let xmltvurl: any = this.config.get<string>('radio.xmltvurl');
    let localFilename = path.join(process.env.APPCACHE, 'epg.xml');
    let reload: boolean = true;
    let xml: any = '';

    if (useCache && fs.existsSync(localFilename)) {
      reload = false;
      xml = fs.readFileSync(localFilename, 'utf8');
    }

    if (reload) {
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
    }

    const parsed = parseXmltv(xml, { asDom: true });
    return parsed;
  }

  public async getEpgForChannel(channel: string, useCache: boolean = true) {
    const parsed = await this.getEpg(useCache);
    let results = parsed
      .find((node) => {
        return node.tagName == 'tv';
      })
      .children.filter((node) => {
        return (
          node.tagName === 'programme' && node.attributes.channel === channel
        );
      })
      .map((programme) => {
        return {
          title: programme.children.find((t) => t.tagName === 'title')
            .children[0],
          desc: programme.children.find((t) => t.tagName === 'desc')
            .children[0],
          icon: programme.children.find((t) => t.tagName === 'icon')
            .children[0],
          start: new Date(programme.attributes.start),
          stop: new Date(programme.attributes.stop),
          channel: programme.attributes.channel,
        };
      })
      .sort((a, b) => {
        return a.start - b.start;
      });

    return results.filter((a) => {
      return a.stop >= Date.now;
    });
  }
}
