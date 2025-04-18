import { RadioPreset } from '@data/dto';
import { Stream } from '@data/dto';
import { RadioService as RadioServiceData } from '@data/radio/radio.service';
import { UserService } from '@data/user/user.service';
import { M3uPlaylist, parseM3U } from '@iptv/playlist';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { ServiceBase } from '@/service-base';

import { MetadataService } from './metadata/metadata.service';
import { RadioBrowserService } from './radio-browser/radio-browser.service';
import { TuneinService } from './tunein/tunein.service';

@Injectable()
export class RadioService extends ServiceBase {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly radioService: RadioServiceData,
    private readonly radioBrowserService: RadioBrowserService,
    private readonly tuneinService: TuneinService,
    private readonly metadataService: MetadataService,
  ) {
    super();
  }

  private readonly log = new Logger(RadioBrowserService.name);

  async getStation(id: string): Promise<RadioPreset> {
    const args = id.split(':');
    let sta: any = {} as any;

    switch (args[0]) {
      case 'tunein':
        sta = await this.tuneinService.getStation(args[1]);
        return {
          id: '',
          stationuuid: 'tunein:' + sta.GuideId,
          name: sta.Title,
          image: sta.Image,
          info: sta,
          database: 'tunein',
        };
      case 'radiobrowser':
        const res = await this.radioBrowserService.searchByUuid([args[1]]);
        sta = res ? res[0] : {};
        return {
          id: '',
          stationuuid: sta.stationuuid,
          name: sta.name,
          image: sta.favicon,
          info: sta,
          database: 'tunein',
        };
    }

    return {} as RadioPreset;
  }

  async savePreset(uuid: string, user: any) {
    const preset: any = await this.getStation(uuid);
    preset.id = user.id;

    return await this.radioService.savePreset(preset);
  }

  async getPresets(user: any) {
    return await this.radioService.getPresets(user.id);
  }

  async importPlaylist(user: any, m3u: string): Promise<Stream[]> {
    const result: Stream[] = [] as Stream[];
    const playlist: M3uPlaylist = parseM3U(m3u);
    const promises: Promise<any>[] = [];

    return new Promise<Stream[]>((resolve, reject) => {
      const creator = (ch) => {
        return new Promise<Stream>((res, rej) => {
          const item: Stream = {} as Stream;
          item.stationuuid =
            'user:' +
            crypto
              .createHash('md5')
              .update(ch.name as string)
              .digest('hex');
          item.url_resolved = ch.url as string;
          item.database = 'user';
          item.name = ch.name as string;
          this.metadataService
            .getMediaIconUrl(ch.name)
            .then((icon) => {
              item.favicon = icon;
              this.radioService
                .updateStream(
                  item.stationuuid,
                  item.name,
                  item.url_resolved,
                  item.favicon,
                  item.database,
                )
                .then(() => {
                  res(item);
                })
                .catch(() => {
                  res(item);
                });
            })
            .catch((err) => {
              this.radioService
                .updateStream(
                  item.stationuuid,
                  item.name,
                  item.url_resolved,
                  item.favicon,
                  item.database,
                )
                .then(() => {
                  res(item);
                })
                .catch(() => {
                  res(item);
                });
            });
        });
      };

      for (let i = 0; i < playlist.channels.length; i++) {
        const ch: any = playlist.channels[i] as any;
        promises.push(creator(ch));
      }

      Promise.allSettled(promises)
        .then((res) => {
          res.forEach((r) => {
            if (r.status == 'fulfilled') {
              result.push(r.value);
            }
          });

          resolve(result);
        })
        .catch((err) => {
          resolve(result);
        });
    });
  }
}
