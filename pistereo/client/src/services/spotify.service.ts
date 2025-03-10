import { ServiceBase } from './service-base';

export class SpotifyService extends ServiceBase {
  public getMyProfile() {
    return this.client().get('/profile/me');
  }
}
