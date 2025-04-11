import { Module } from '@nestjs/common';
import { MongoConnectionService } from './mongo-connection/mongo-connection.service';
import { UserService } from './user/user.service';
import { RadioService } from './radio/radio.service';

@Module({
  imports: [
    MongoConnectionService.setup(),
    MongoConnectionService.getSchemas(),
  ],
  providers: [MongoConnectionService, UserService, RadioService],
  exports: [UserService, RadioService],
})
export class DataModule {}
