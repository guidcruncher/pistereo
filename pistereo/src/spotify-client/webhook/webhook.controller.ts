import { PlayerWebhookData } from '../spotify-client.d';
import { Controller, Get, Logger, Post, Body, Req, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Public } from '../auth/public.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Public()
@Controller('webhook')
export class WebhookController {
  private readonly log = new Logger(WebhookController.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async libRespotWebhook(@Body() formData: PlayerWebhookData, @Res() res) {
    /// payload   {"playerEvent":"playing","trackId":"6VRhkROS2SZHGlp0pxndbJ","oldTrackId":""}
    res.status(204).send();
  }
}
