import { PagedList } from '@data/dto/pagedlist';
import { RadioService } from '@data/radio/radio.service';
import { UserService } from '@data/user/user.service';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ServiceBase } from '@/service-base';

import { StreamerService } from '../../streamer-client/streamer/streamer.service';
import { Station } from './models';

@Injectable()
export class TuneinService extends ServiceBase {
  constructor(
    private readonly config: ConfigService,
    private readonly streamerService: StreamerService,
    private readonly userService: UserService,
    private readonly radioService: RadioService,
  ) {
    super();
  }

  private readonly log = new Logger(TuneinService.name);

  private parseId(id: string) {
    return id.replaceAll('tunein:', '');
  }

  public async getStation(guideId: string) {
    const params = new URLSearchParams();
    params.append('render', 'json');
    params.append('formats', 'mp3,aac,ogg,flash,html,hls,wma');
    params.append('partnerId', 'RadioTime');
    const url =
      'https://api.radiotime.com/profiles/' +
      this.parseId(guideId) +
      '?' +
      params.toString();
    const result = await fetch(url, { method: 'GET' });

    const obj = await result.json();
    return obj.Item;
  }

  public async getStreamUrl(guideId: string) {
    const params = new URLSearchParams();
    params.append('id', this.parseId(guideId));
    params.append('render', 'json');
    params.append('formats', 'mp3,aac,ogg,flash,html,hls,wma');
    params.append('partnerId', 'RadioTime');
    params.append('version', '4.4601');
    params.append('itemUrlScheme', 'secure');
    params.append('reqAttempt', '1');
    const url = 'https://opml.radiotime.com/Tune.ashx?' + params.toString();
    const result = await fetch(url, { method: 'GET' });

    const obj = await result.json();
    return obj.body;
  }

  public async streamStation(user: any, guideId: string) {
    const streamdata = await this.getStreamUrl(guideId);
    const station = await this.getStation(guideId);
    this.log.log(this.__caller() + ' =>streamStatiom');
    this.userService.updateLastPlayed(
      user.id,
      user.display_name,
      'streamer',
      streamdata[0].url,
      {
        source: 'streamer',
        stationuuid: 'tunein:' + this.parseId(guideId),
        uri: streamdata[0].url,
        name: station.Title,
        description: station.Subtitle,
        owner: station.Title,
        image: station.Image,
      },
    );
    await this.streamerService.play(streamdata[0].url);
  }

  public async search(
    query: string,
    offset: number,
    limit: number,
  ): Promise<PagedList<Station>> {
    const params = new URLSearchParams();
    params.append('fullTextSearch', 'true');
    params.append('formats', 'mp3,aac,ogg,flash,html,hls,wma');
    params.append('partnerId', 'RadioTime');
    params.append('itemUrlScheme', 'secure');
    params.append('reqAttempt', '1');
    params.append('query', query);
    const url = 'https://api.tunein.com/profiles?' + params.toString();

    const result = await fetch(url, { method: 'GET' });

    const obj = await result.json();

    const view: Station[] = [];

    for (const item of obj.Items) {
      switch (item.ContainerType) {
        case 'Stations':
          item.Children.forEach((c) => {
            const st: Station = {} as Station;
            st.stationuuid = 'tunein:' + c.GuideId;
            st.radioUrl = '';
            st.guideId = c.GuideId;
            st.image = c.Image;
            st.title = c.Title;
            st.shareUrl = c.Actions.Share.ShareUrl;

            view.push(st);
          });
          break;
      }
    }

    return PagedList.fromArray<Station>(view, offset, limit);
  }
}
