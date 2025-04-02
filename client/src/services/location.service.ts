import { ServiceBase } from './service-base';
import axios, { type AxiosResponse } from 'axios';

export class LocationService extends ServiceBase {
  constructor() {
    super('');
  }
  public async getCurrentIpAddress(): Promise<any> {
    const response: AxiosResponse<any> = await this.client({
      isPublic: true,
      baseUrl: 'https://api.ipify.org',
    }).get('/?format=json');
    return response.data;
  }

  public async getIpAddressInfo(ip: string): Promise<any> {
    const response: AxiosResponse<any> = await this.client({
      isPublic: true,
      baseUrl: 'https://ipinfo.io',
    }).get('/' + ip + '/json');
    return response.data;
  }

  public async getCurrentIpAddressInfo(): Promise<any> {
    const ip: any = await this.getCurrentIpAddress();
    return await this.getIpAddressInfo(ip.ip);
  }
}
