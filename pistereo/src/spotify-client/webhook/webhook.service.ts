import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlayerWebhookData } from '../spotify-client.d';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WebhookService {
  private readonly log = new Logger(WebhookService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async emitEvent(name: string, payload: any) {
    this.eventEmitter.emit('player.event', {
      name: name,
      fired: new Date().toISOString(),
      payload: payload,
      randomNumber: Math.random(),
    });
  }

  public async processEvent(ev: PlayerWebhookData) {
    if (!ev.playerEvent || ev.playerEvent == '') {
      return false;
    }

    this.log.debug('Processing webhook ' + ev.playerEvent);

    switch (ev.playerEvent) {
      case 'auto_play_changed':
        return false;
      case 'end_of_track':
        return false;
      case 'filter_explicit_content_changed':
        return false;
      case 'loading':
        return false;
      case 'paused':
        await this.emitEvent(ev.playerEvent, {});
        return true;
      case 'playing':
        await this.emitEvent(ev.playerEvent, {});
        return true;
      case 'position_correction':
        return false;
      case 'preload_next':
        return false;
      case 'preloading':
        return false;
      case 'repeat_changed':
        return false;
      case 'seeked':
        return false;
      case 'session_client_changed':
        return false;
      case 'session_connected':
        await this.emitEvent(ev.playerEvent, {});
        return true;
      case 'session_disconnected':
        await this.emitEvent(ev.playerEvent, {});
        return true;
      case 'shuffle_changed':
        return false;
      case 'stopped':
        await this.emitEvent(ev.playerEvent, {});
        return true;
      case 'track_changed':
        await this.emitEvent(ev.playerEvent, {});
        return true;
      case 'unavailable':
        await this.emitEvent(ev.playerEvent, {});
        return true;
      case 'volume_changed':
        await this.emitEvent(ev.playerEvent, {});
        return true;
    }

    return false;
  }
}
