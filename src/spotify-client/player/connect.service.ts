import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SpotifyBaseService } from '../spotify-base.service';

@Injectable()
export class ConnectService extends SpotifyBaseService {
  constructor(private readonly config: ConfigService) {
    super();
  }

  private readonly log = new Logger(ConnectService.name);
}
