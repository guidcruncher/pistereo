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

  public async getCurrentPlayingTrack(token: string): Promise<any> {
    const result = await fetch(
      'https://api.spotify.com/v1/me/player/current-playing',
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
    positionMs: number,
  ): Promise<any> {
    const result = await fetch(
      'https://api.spotify.com/v1/me/player/play?device_id=' +
        encodeURIComponent(deviceId),
      {
        method: 'PUT',
        body: JSON.stringify({
          context_uri: contextUri,
          position_ms: positionMs ?? 0,
        }),
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
}
