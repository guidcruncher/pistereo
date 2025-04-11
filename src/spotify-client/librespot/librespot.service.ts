import { Injectable, Logger } from '@nestjs/common';
import * as util from 'util';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { SpotifyBaseService } from '../spotify-base.service';
import { GetStatusResponse, Play } from '../spotify-client.d';

const exec = util.promisify(require('node:child_process').exec);

@Injectable()
export class LibrespotService extends SpotifyBaseService {
  private readonly log = new Logger(LibrespotService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  private getApiUrl(path: string) {
    return process.env.LIBRESPOT_HOST + path;
  }

  public async getStatus(): Promise<GetStatusResponse> {
    try {
      this.log.log(this.__caller() + ' => getStatus');
      const result = await fetch(this.getApiUrl('/status'), { method: 'GET' });
      return (await result.json()) as GetStatusResponse;
    } catch (err) {
      return {} as GetStatusResponse;
    }
  }

  public async getVolume(): Promise<any> {
    this.log.log(this.__caller() + ' =>getVolume');
    const result = await fetch(this.getApiUrl('/player/volume'), {
      method: 'GET',
    });
    return await result.json();
  }

  public async setVolume(volume: number, relative: boolean) {
    this.log.log(this.__caller() + ' =>setVolume');
    const result = await fetch(this.getApiUrl('/player/volume'), {
      method: 'POST',
      body: JSON.stringify({ volume: volume, relative: relative }),
      headers: { 'Content-Type': 'application/json' },
    });
    let txt = await result.text();

    if (txt != '') {
      return JSON.parse(txt);
    }

    return {};
  }

  public async play(request: Play) {
    this.log.log(this.__caller() + ' =>play');
    let status: any = await this.getStatus();

    const result = await fetch(this.getApiUrl('/player/play'), {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!result.ok) {
      this.log.error(
        'Error playing ' + result.status + ' / ' + (await result.text()),
      );
      return;
    }
    return await this.getStatus();
  }

  public async playpause() {
    this.log.log(this.__caller() + ' =>playpause');
    const result = await fetch(this.getApiUrl('/player/playpause'), {
      method: 'POST',
    });
    return await this.getStatus();
  }

  public async pause() {
    this.log.log(this.__caller() + ' =>pause');
    const result = await fetch(this.getApiUrl('/player/pause'), {
      method: 'POST',
    });
    return await this.getStatus();
  }

  public async stop() {
    this.log.log(this.__caller() + ' =>stop');
    return await this.pause();
  }

  public async resume() {
    this.log.log(this.__caller() + ' =>resume');
    const result = await fetch(this.getApiUrl('/player/resume'), {
      method: 'POST',
    });
    return await this.getStatus();
  }

  public async next(uri: string) {
    this.log.log(this.__caller() + ' =>next');
    const result = await fetch(this.getApiUrl('/player/next'), {
      method: 'POST',
      body: JSON.stringify({ uri: uri }),
      headers: { 'Content-Type': 'application/json' },
    });
    return await this.getStatus();
  }

  public async previous() {
    this.log.log(this.__caller() + ' =>previous');
    const result = await fetch(this.getApiUrl('/player/prev'), {
      method: 'POST',
    });
    return await this.getStatus();
  }

  public async queue(uri: string) {
    this.log.log(this.__caller() + ' =>queue');
    const result = await fetch(this.getApiUrl('/player/add_to_queue'), {
      method: 'POST',
      body: JSON.stringify({ uri: uri }),
      headers: { 'Content-Type': 'application/json' },
    });

    return await result.json();
  }
}
