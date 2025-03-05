import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dto from '../dto';

@Injectable()
export class ConnectService {
  constructor(private readonly config: ConfigService) {}

  private readonly log = new Logger(ConnectService.name);
}
