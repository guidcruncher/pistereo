import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@data/user/user.service';
import { ServiceBase } from '@/service-base';
import { RadioService as RadioServiceData } from '@data/radio/radio.service';
import { RadioPreset, Station } from '@data/dto';
import { RadioBrowserService } from './radio-browser/radio-browser.service';
import { TuneinService } from './tunein/tunein.service';

@Injectable()
export class RadioService extends ServiceBase {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly radioService: RadioServiceData,
    private readonly radioBrowserService: RadioBrowserService,
    private readonly tuneinService: TuneinService,
  ) {
    super();
  }

  private readonly log = new Logger(RadioBrowserService.name);

  async getStation(id: string): Promise<RadioPreset> {
    let args = id.split(':');
    let sta: any = {} as any;

    switch (args[0]) {
      case 'tunein':
        sta = await this.tuneinService.getStation(args[1]);
        return {
          id: '',
          stationuuid: 'tunein:' + sta.GuideId,
          name: sta.Title,
          image: sta.Image,
          info: sta,
          database: 'tunein',
        };
      case 'radiobrowser':
        let res = await this.radioBrowserService.searchByUuid([args[1]]);
        sta = res ? res[0] : {};
        return {
          id: '',
          stationuuid: sta.stationuuid,
          name: sta.name,
          image: sta.favicon,
          info: sta,
          database: 'tunein',
        };
    }

    return {} as RadioPreset;
  }

  async savePreset(uuid: string, user: any) {
    const preset: any = await this.getStation(uuid);
    preset.id = user.id;

    return await this.radioService.savePreset(preset);
  }

  async getPresets(user: any) {
    return await this.radioService.getPresets(user.id);
  }
}
