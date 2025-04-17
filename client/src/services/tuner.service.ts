import { ServiceBase } from './service-base';
import axios, { type AxiosResponse } from 'axios';
import { LocationService } from './location.service';
import { JackService } from './jack.service';
import { on, emit, off } from '../composables/useeventbus';
import { usePlayerStore } from '@/stores/player';

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
    return [];
    const response: AxiosResponse<any> = await this.client().get(
      '/epg/' + uuid,
    );
    return response.data;
  }

  public async searchStations(query: string, offset: number, limit: number) {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());
    const response: AxiosResponse<any> = await this.client('/api/radio').get(
      '/tunein/search?' + params.toString(),
    );
    return response.data;
  }

  public async getStation(uuid: string): Promise<Station> {
    const response: AxiosResponse<any> = await this.client('/api/radio').get(
      '/tunein/' + uuid,
    );
    return response.data as Station;
  }

  public async playStation(uuid: string): Promise<any> {
    const response: AxiosResponse<any> = await this.client('/api/radio').put(
      '/tunein/' + uuid,
    );
    usePlayerStore().setSource('streamer');
    emit('audio_changed', {
      source: 'streamer',
      trigger: 'playStation',
      context: '',
      uri: uuid,
    });
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
