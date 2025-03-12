import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dto from '../dto';

@Injectable()
export class PlayerService {
  constructor(private readonly config: ConfigService) {}

  private readonly log = new Logger(PlayerService.name);

  public async getPlaybackState(token: string): Promise<any> {
    const result = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    return await dto.ApiResult.create(result);
  }

  public async transferPlayback(
    token: string,
    deviceIds: string[],
  ): Promise<any> {
    const result = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      body: JSON.stringify({ device_ids: deviceIds }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await dto.ApiResult.create(result);
  }

  public async getAvailableDevices(token: string): Promise<any> {
    const result = await fetch('https://api.spotify.com/v1/me/player/devices', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await dto.ApiResult.create(result);
  }

  public async getDeviceIdByName(token: string, name: string): Promise<any> {
    let result = await this.getAvailableDevices(token);
    if (!result) {
      return '';
    }

    if (result.result.devices) {
      let device = result.result.devices.find((device) => {
        return device.name == name;
      });

      if (!device) {
        return '';
      }

      return device.id;
    }

    return '';
  }

  public async getCurrentPlayingTrack(token: string): Promise<any> {
    const result = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return await dto.ApiResult.create(result);
  }

  public async startResumePlayback(
    token: string,
    deviceId: string,
    contextUri: string,
    uris: string[],
    positionMs: number,
  ): Promise<any> {
    let body: string = JSON.stringify({
      context_uri: contextUri,
      position_ms: positionMs ?? 0,
    });

    if (uris && uris.length > 0) {
      body = JSON.stringify({
        context_uri: contextUri,
        position_ms: positionMs ?? 0,
        uris: uris,
      });
    }

    const result = await fetch(
      'https://api.spotify.com/v1/me/player/play?device_id=' +
        encodeURIComponent(deviceId),
      {
        method: 'PUT',
        body: body,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return await dto.ApiResult.create(result);
  }

  public async setPlaybackVolume(
    token: string,
    deviceId: string,
    level: number,
  ): Promise<any> {
    const result = await fetch(
      'https://api.spotify.com/v1/me/player/volume?volume_percent=' +
        level +
        '&device_id=' +
        encodeURIComponent(deviceId),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return await dto.ApiResult.create(result);
  }

  public async skipNext(token: string, deviceId: string): Promise<any> {
    const result = await fetch(
      'https://api.spotify.com/v1/me/player/next?&device_id=' +
        encodeURIComponent(deviceId),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return await dto.ApiResult.create(result);
  }

  public async skipPrevious(token: string, deviceId: string): Promise<any> {
    const result = await fetch(
      'https://api.spotify.com/v1/me/player/previous?device_id=' +
        encodeURIComponent(deviceId),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return await dto.ApiResult.create(result);
  }

  public async getRecentlyPlayed(
    token: string,
    limit: number = 20,
    after: number = 0,
    before: number = 0,
  ): Promise<any> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (before && before > 0) {
      params.append('before', before.toString());
    } else {
      if (after && after > 0) {
        params.append('after', after.toString());
      }
    }
    const result = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?' +
        params.toString(),
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return await dto.ApiResult.create(result);
  }

  public async getPlaybackQueue(token: string): Promise<any> {
    const result = await fetch('https://api.spotify.com/v1/me/player/queue', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await dto.ApiResult.create(result);
  }

  public async addToPlaybackQueue(
    token: string,
    uri: string,
    deviceId: string,
  ) {
    const params = new URLSearchParams();
    params.append('uri', uri);
    params.append('device_id', deviceId);

    const result = await fetch(
      'https://api.spotify.com/v1/me/player/queue?' + params.toString(),
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return await dto.ApiResult.create(result);
  }

  public getWebPlayer(accessToken: string): string {
    if (!accessToken || accessToken == '') {
      return '';
    }

    let html =
      '<!DOCTYPE html><html><head><title>Spotify Web Playback</title></head><body>';
    html +=
      '<h1>Spotify Web Playback</h1><script src="https://sdk.scdn.co/spotify-player.js"></script>';
    html += '<script type="text/javascript">';
    html += 'window.onSpotifyWebPlaybackSDKReady = () => {';
    html += 'const token = ' + JSON.stringify(accessToken) + ';';
    html +=
      'const player = new Spotify.Player({name: "Web Player", getOAuthToken: cb => { cb(token); }, volume: 1}); }';
    html += '</script></body></html>';

    return html;
  }
}
