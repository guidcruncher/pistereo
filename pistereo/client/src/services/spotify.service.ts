import { ServiceBase } from './service-base';
import axios, { type AxiosResponse } from 'axios';

export class SpotifyService extends ServiceBase {
  public async getMyProfile(): Promise<PublicUser> {
    const response: AxiosResponse<PublicUser> =
      await this.client().get('/profile/me');
    return response.data;
  }
}
