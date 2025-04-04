import { ServiceBase } from './service-base';
import axios, { type AxiosResponse } from 'axios';
import { LocationService } from './location.service';
import { JackService } from './jack.service';

export class TunerService extends ServiceBase {
  constructor() {
    super('/api/radio');
  }

  public async stop() {
    const response: AxiosResponse<any> = await this.client({
      baseUrl: '/api/stream',
    }).put('/stop');
    return response.data;
  }

  public async getEpg(uuid: string) {
    const response: AxiosResponse<any> = await this.client().get(
      '/epg/' + uuid,
    );
    return response.data;
  }

  public async getDefaultSearch(): Promise<StationSearchRequest> {
    const ls: LocationService = new LocationService();
    const query: StationSearchRequest = {} as StationSearchRequest;

    return query;

    const locn = await ls.getCurrentIpAddressInfo();
    const nav: any = navigator;
    query.language = nav.language || nav.userLanguage;
    if (locn) {
      if (locn.country) {
        const regionNames = new Intl.DisplayNames([query.language], {
          type: 'region',
        });
        query.country = regionNames.of(locn.country) as string;
      }
    }
    return query;
  }

  public async searchStations(
    query: StationSearchRequest,
    offset: number,
    limit: number,
  ) {
    const params = new URLSearchParams();
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());
    const response: AxiosResponse<any> = await this.client('/api/radio').post(
      '/search?' + params.toString(),
      query,
    );
    return response.data;
  }

  public async getStation(uuid: string): Promise<Station> {
    const response: AxiosResponse<any> = await this.client('/api/radio').get(
      '/' + uuid,
    );
    return response.data as Station;
  }

  public async playStation(uuid: string): Promise<any> {
    const response: AxiosResponse<any> = await this.client('/api/radio').put(
      '/' + uuid,
    );
    return response.data;
  }

  public async saveStationPreset(uuid: string): Promise<any> {
    const response: AxiosResponse<any> = await this.client('/api/radio').put(
      '/presets/' + uuid,
    );
    return response.data;
  }

  public async getStationPresets(): Promise<RadioPreset[]> {
    const response: AxiosResponse<any> =
      await this.client('/api/radio').get('/presets');
    return response.data as RadioPreset[];
  }

  public async setVolume(value: number) {
    const response: AxiosResponse<any> = await this.client({
      baseUrl: '/api/stream',
    }).put('/volume?volume=' + value.toString());
    return response.data;
  }

  public async getStatus() {
    const response: AxiosResponse<any> = await this.client({
      baseUrl: '/api/stream',
    }).get('');
    return response.data as any;
  }
}
