import { lookupLanguage, PagedList, SearchRequest } from './models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StreamerService } from '../../streamer-client/streamer/streamer.service';
import * as dns from 'dns';
import * as util from 'util';
import { UserService } from '@data/user/user.service';
import { ServiceBase } from '@/service-base';
import { RadioService } from '@data/radio/radio.service';
import { Station } from '@data/dto';

const resolveSrv = util.promisify(dns.resolveSrv);

@Injectable()
export class RadioBrowserService extends ServiceBase {
  constructor(
    private readonly config: ConfigService,
    private readonly streamerService: StreamerService,
    private readonly userService: UserService,
    private readonly radioService: RadioService,
  ) {
    super();
  }

  private readonly log = new Logger(RadioBrowserService.name);

  private getBaseUrl(): string {
    return (this.config.get('radio.radiobrowser') as string) + '/json';
  }

  public async getHosts() {
    this.log.log(this.__caller() + ' =>gethosts');
    return resolveSrv('_api._tcp.radio-browser.info').then((hosts) => {
      hosts.sort();
      return hosts.map((host) => 'https://' + host.name + '/json');
    });
  }

  public async searchByUuid(uuids: string[]) {
    const baseUrl = await this.getBaseUrl();
    const params = new URLSearchParams();
    let json: any[] = [];
    const stUUIds: string[] = uuids
      .filter((u) => {
        return u.startsWith('radiobrowser:');
      })
      .map((s) => {
        return s.replaceAll('radiobrowser:', '');
      });

    if (stUUIds.length > 0) {
      params.append('uuids', stUUIds.join(','));
      this.log.log(this.__caller() + ' =>searchByUUID');
      const result = await fetch(
        baseUrl + '/stations/byuuid?' + params.toString(),
        {
          method: 'GET',
        },
      );

      const tmp = (await result.json()) as Station[];
      json = json.concat(tmp);
    }

    return json;
  }

  public async search(query: SearchRequest, offset: number, limit: number) {
    const baseUrl = await this.getBaseUrl();
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    params.append('reverse', 'false');
    params.append('hidebroken', 'true');
    this.log.log(this.__caller() + ' =>search');
    Object.keys(query).forEach((key) => {
      if (!key.includes('Exact')) {
        if (typeof query[key] !== 'undefined' && query[key] !== null) {
          switch (key) {
            case 'language':
              const lang: any = lookupLanguage(query[key]);
              if (lang.name != '') {
                params.append(key, lang.name.toLowerCase());
              } else {
                params.append(key, query[key].toString());
              }
              params.append('languageExact', 'true');
              break;
            case 'country':
              let ctry: any =
                query[key] == 'United States'
                  ? 'The United States Of America'
                  : query[key];
              if (ctry == 'United Kingdom') {
                ctry =
                  'The United Kingdom Of Great Britain And Northern Ireland';
              }
              params.append(key, ctry);
              params.append('countryExact', 'false');
              break;
            case 'tagList':
              params.append(key, query[key].join(','));
              params.append('tagExact', 'true');
              break;
            default:
              params.append(key, query[key].toString());
              break;
          }
        }
      }
    });
    this.log.debug(
      'Search Parameters ' + baseUrl + '/stations/search?' + params.toString(),
    );

    const result = await fetch(
      baseUrl + '/stations/search?' + params.toString(),
      {
        method: 'GET',
      },
    );
    const json: any = await result.json();

    for (let i = 0; i < json.length; i++) {
      json[i].stationuuid = 'radiobrowser:' + json[i].stationuuid;
      if (json[i].favicon == '') {
        const ch = await this.radioService.getChannel(json[i].stationuuid);
        if (ch) {
          json[i].favicon = ch.icon_url;
        }
      }
    }
    return json;
  }

  public async streamStation(user: any, uuid: string) {
    const result: any = await this.searchByUuid([uuid]);

    this.log.log(this.__caller() + ' =>streamStatiom');
    if (result.length > 0) {
      this.userService.updateLastPlayed(
        user.id,
        user.display_name,
        'streamer',
        result[0].url_resolved,
        {
          source: 'streamer',
          stationuuid: result[0].stationuuid,
          uri: result[0].url_resolved,
          name: result[0].name,
          description: result[0].country,
          owner: result[0].homepage,
          image: result[0].favicon,
        },
      );
      await this.streamerService.play(result[0].url_resolved);
      return result[0];
    }
    throw new NotFoundException('Station not found.');
  }

  async savePreset(uuid: string, user: any) {
    const result: any = await this.searchByUuid([uuid]);
    if (result) {
      if (result[0].favicon == '') {
        const ch = await this.radioService.getChannel(uuid);
        if (ch) {
          result[0].favicon = ch.icon_url;
        }
      }
      return await this.radioService.savePreset({
        stationuuid: uuid,
        id: user.id,
        name: result[0].name,
        image: result[0].favicon,
        info: result[0],
        database: 'radiobrowser',
      });
    }
  }

  async getPresets(user: any) {
    return await this.radioService.getPresets(user.id);
  }
}
