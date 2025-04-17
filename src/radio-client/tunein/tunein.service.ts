import { Station } from './models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StreamerService } from '../../streamer-client/streamer/streamer.service';
import { ServiceBase } from '@/service-base';
import { RadioService } from '@data/radio/radio.service';

@Injectable()
export class TuneinService extends ServiceBase {
  constructor(
    private readonly config: ConfigService,
    private readonly streamerService: StreamerService,
    private readonly radioService: RadioService,
  ) {
    super();
  }

  private readonly log = new Logger(TuneinService.name);

  public async Search(query: string) {
    let params = new URLSearchParams();
    params.append('fullTextSearch', 'true');
    params.append('formats', 'mp3,aac,ogg,flash,html,hls,wma');
    params.append('partnerId', 'RadioTime');
    params.append('itemUrlScheme', 'secure');
    params.append('reqAttempt', '1');
    params.append('query', query);
    let url = 'https://api.tunein.com/profiles?' + params.toString();

    const result = await fetch(url, { method: 'GET' });

    const obj = await result.json();
    return obj;
  }
}
