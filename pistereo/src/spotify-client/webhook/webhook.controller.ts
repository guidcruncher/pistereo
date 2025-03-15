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
import { WebhookService } from './webhook.service';
import { Public } from '../auth/public.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

@Public()
@Controller('webhook')
export class WebhookController {
  private readonly log = new Logger(WebhookController.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async libRespotWebhook(@Body() formData: any, @Res() res) {
    await this.webhookService.processEvent(formData as PlayerWebhookData);
    res.status(204).send();
  }

  @Sse('/sse')
  async sse(): Promise<Observable<MessageEvent>> {
    return fromEvent(this.eventEmitter, 'player.event').pipe(
      map((payload) => ({
        data: JSON.stringify(payload),
      })),
    );
  }
}
