import { LibrespotService } from '../spotify-client/librespot/librespot.service';
import { StreamerService } from '../streamer-client/streamer/streamer.service';
import { Injectable, MessageEvent, Logger } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';
import { UserService } from '@data/user/user.service';
import { ServiceBase } from '@/service-base';

@Injectable()
export class JackService extends ServiceBase {
  private readonly log = new Logger(JackService.name);

  constructor(
    private readonly librespotService: LibrespotService,
    private readonly streamerService: StreamerService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async restartLastPlayed() {
    let playing: any = await this.userService.getLastPlayed();

    if (!playing || !playing.playing) {
      return;
    }
    switch (playing.playing.source) {
      case 'spotify':
        this.librespotService.play({
          uri: playing.playing.uri,
          skip_to_uri: '',
          paused: false,
        });
        break;
      case 'streamer':
        this.streamerService.play(playing.playing.stationuuid);
        break;
    }
  }

  async getStatus() {
    try {
      let spotifyStatus: any = await this.librespotService.getStatus();
      let streamerStatus: any = await this.streamerService.getStatus();
      let playing: any = await this.userService.getLastPlayed();
      let results: any = { playing: playing ? playing.detail : {}, source: [] };
      this.log.log(this.__caller() + ' =>getStatus');
      if (spotifyStatus && spotifyStatus.track) {
        results.source.push('spotify');
      }

      if (streamerStatus && streamerStatus.active) {
        results.source.push('streamer');
      }

      return results;
    } catch (err) {
      this.log.error('Error in getStatus', err);
      return { playing: {}, source: [] };
    }
  }

  async stopAll() {
    this.log.log(this.__caller() + ' => stopAll ');
    await this.streamerService.stop();
    await this.librespotService.stop();
    return true;
  }

  async eject() {
    this.log.log(this.__caller() + ' => eject');
    let playing: any = await this.userService.getLastPlayed();
    if (playing) {
      await this.stopDevice(playing.source);
    }
    return await this.userService.deleteLastPlayed();
  }

  async stopDevices() {
    await this.stopDevice('streamer');
    await this.stopDevice('spotify');
  }

  async stopDevice(name: string) {
    this.log.log(this.__caller() + ' => stopDevice ' + name);
    switch (name) {
      case 'streamer':
        await this.streamerService.stop();
        return true;
      case 'spotify':
        await this.librespotService.stop();
        return true;
    }

    return false;
  }
}
