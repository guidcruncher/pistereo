import { AuthModule } from '@auth/auth.module';
import { DataModule } from '@data/data.module';
import { Module } from '@nestjs/common';

import { StreamerController } from './streamer/streamer.controller';
import { StreamerService } from './streamer/streamer.service';
import { StreamerSocketService } from './streamer/streamer-socket.service';
import { WebhookController } from './streamer/webhook.controller';

@Module({
  providers: [StreamerService, StreamerSocketService],
  controllers: [StreamerController, WebhookController],
  imports: [AuthModule, DataModule],
  exports: [StreamerService],
})
export class StreamerClientModule {}
