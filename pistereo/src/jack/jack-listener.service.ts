import { LibrespotService } from '../spotify-client/librespot/librespot.service';
import { StreamerService } from '../streamer-client/streamer/streamer.service';
import { Injectable, MessageEvent, Logger } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';
import { UserService } from '@data/user/user.service';

@Injectable()
export class JackListenerService {
  private readonly log = new Logger(JackListenerService.name);

  constructor(
    private readonly librespotService: LibrespotService,
    private readonly streamerService: StreamerService,
    private readonly userService: UserService,
  ) {}

  @OnEvent('jack.input_changes')
  async inputChanged(payload: any) {
    if (payload == 'spotify') {
      this.log.debug('Jack input changing to: ' + payload);
      await this.streamerService.stop();
    }

    if (payload == 'streamer') {
      this.log.debug('Jack input changing to: ' + payload);
      await this.librespotService.stop();
    }
  }

  @OnEvent('jack.switch')
  async change(payload: any) {
    if (payload == 'spotify') {
      this.log.debug('Jack input changed to: ' + payload);
      await this.streamerService.stop();
    }
    if (payload == 'streamer') {
      this.log.debug('Jack input changed to: ' + payload);
      await this.librespotService.stop();
    }
  }
}
