import { Public } from '@auth/public.decorator';
import {
  Controller,
  Logger,
  MessageEvent,
  Sse,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { fromEvent, map,Observable } from 'rxjs';

import { StreamerService } from './streamer.service';

@Public()
@Controller('/api/streamer')
export class WebhookController {
  private readonly log = new Logger(WebhookController.name);

  constructor(
    private readonly streamerService: StreamerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Sse('/sse')
  async sse(): Promise<Observable<MessageEvent>> {
    return fromEvent(this.eventEmitter, 'streamer.event').pipe(
      map((payload) => ({
        data: JSON.stringify(payload),
      })),
    );
  }
}
