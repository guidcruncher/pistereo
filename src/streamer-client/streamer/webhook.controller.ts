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
import { StreamerService } from './streamer.service';
import { Public } from '@auth/public.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

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
