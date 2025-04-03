import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel } from '@data/dto/xmltvradiolink.dto';

@Injectable()
export class EpgService {
  constructor(private readonly config: ConfigService) {}

  private readonly log = new Logger(EpgService.name);

  public async initialiseCron() {
    const cronHours = (this.config.get<string>('radio.xmltvrefresh') ??  "").split(',') as string[];
  }

  public async downloadEpg() {
    let xmltvurl: any = this.config.get<string>('radio.xmltvurl');
    let xmltvchannels: any = this.config.get<string>('radio.xmltvchannels');
    const result = await fetch(xmltvchannels, {
      method: 'GET',
    });

    let channels: Channel[] = (await result.json()) as Channel[];
  }
}
