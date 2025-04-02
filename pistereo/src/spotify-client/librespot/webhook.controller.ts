import { PlayerWebhookData } from '../spotify-client.d';
import {
  Controller,
  Sse,
  MessageEvent,
  Get,
  Logger,
  Post,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { LibrespotService } from './librespot.service';
import { Public } from '@auth/public.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

@Public()
@Controller('/api/spotify')
export class WebhookController {
  private readonly log = new Logger(WebhookController.name);

  constructor(
    private readonly librespotService: LibrespotService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Sse('/sse')
  async sse(): Promise<Observable<MessageEvent>> {
    return fromEvent(this.eventEmitter, 'player.event').pipe(
      map((payload) => ({
        data: JSON.stringify(payload),
      })),
    );
  }
}
