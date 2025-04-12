import { ServiceBase } from './service-base';
import axios, { type AxiosResponse } from 'axios';
import { LocationService } from './location.service';

export class JackService extends ServiceBase {
  constructor() {
    super('/api/jack');
  }

  public async stop() {
    const response: AxiosResponse<any> = await this.client().put('/stop');
    return response.data;
  }

  public async eject() {
    const response: AxiosResponse<any> = await this.client().put('/eject');
    return response.data;
  }

  public async stopDevice(device: string) {
    const response: AxiosResponse<any> = await this.client().put(
      '/stop/' + device,
    );
    return response.data;
  }

  public async getStatus() {
    const response: AxiosResponse<any> = await this.client().get('');
    return response.data;
  }

  public async getStreamerStatus() {
    const response: AxiosResponse<any> = await this.client({
      baseUrl: '/api/stream',
    }).get('');
    return response.data;
  }
}
