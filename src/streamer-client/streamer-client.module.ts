import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { StreamerService } from './streamer/streamer.service';
import { StreamerSocketService } from './streamer/streamer-socket.service';
import { StreamerController } from './streamer/streamer.controller';
import { WebhookController } from './streamer/webhook.controller';
import { DataModule } from '@data/data.module';
import { TokenGuard } from '@auth/token.guard';
import { AuthModule } from '@auth/auth.module';

@Module({
  providers: [StreamerService, StreamerSocketService],
  controllers: [StreamerController, WebhookController],
  imports: [AuthModule, DataModule],
  exports: [StreamerService],
})
export class StreamerClientModule {}
