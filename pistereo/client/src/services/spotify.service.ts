import { ServiceBase } from './service-base';
import axios, { type AxiosResponse } from 'axios';

export class SpotifyService extends ServiceBase {
  public async getMyProfile(): Promise<PublicUser> {
    const response: AxiosResponse<PublicUser> =
      await this.client().get('/profile/me');
    return response.data;
  }

  public async getDevice(): Promise<DeviceObject> {
    const response: AxiosResponse<DeviceObject> =
      await this.client().get('/player/default');
    return response.data;
  }

  public async playerOp(id: string, command: string): Promise<any> {
    const playerCommand = async (id, command) => {
      let response: AxiosResponse<any> = {};
      let params = new URLSearchParams();
      params.append('device_id', id);

      switch (command) {
        case 'connect':
          response = await this.client().put('/player', {
            deviceids: [id],
            play: true,
          });
          return response.data;
        case 'previous':
          response = await this.client().put(
            '/player/previous?' + params.toString(),
            {},
          );
          return response.data;
        case 'play':
          response = await this.client().put('/player/play', {
            deviceId: id,
            positionMs: 0,
          });
          return response.data;
        case 'pause':
          response = await this.client().put(
            '/player/pause?' + params.toString(),
            {},
          );
          return response.data;
        case 'stop':
          response = this.client().put('/player/stop?' + params.toString(), {});
          return response.data;
        case 'next':
          response = await this.client().put(
            '/player/next?' + params.toString(),
            {},
          );
          return response.data;
      }
    };

    return await playerCommand(id, command);
  }
}
