import { Module } from '@nestjs/common';

import { MongoConnectionService } from './mongo-connection/mongo-connection.service';
import { RadioService } from './radio/radio.service';
import { UserService } from './user/user.service';

@Module({
  imports: [
    MongoConnectionService.setup(),
    MongoConnectionService.getSchemas(),
  ],
  providers: [MongoConnectionService, UserService, RadioService],
  exports: [UserService, RadioService],
})
export class DataModule {}
