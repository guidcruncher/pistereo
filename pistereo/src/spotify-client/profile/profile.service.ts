import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dto from '../dto';

@Injectable()
export class ProfileService {
  constructor(private readonly config: ConfigService) {}

  private readonly log = new Logger(ProfileService.name);

  public async fetchMyProfile(token: string): Promise<dto.UserProfile> {
    const result = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    return await result.json();
  }

  public async fetchProfile(token: string, userId: string) {
    const result = await fetch('https://api.spotify.com/v1/users/' + userId, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    return await dto.ApiResult.create(result);
  }

  public async getTopItems(token: string, itemType: string) {
    const result = await fetch(
      'https://api.spotify.com/v1/me/top/' + itemType,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await dto.ApiResult.create(result);
  }

  public async getFollowedArtists(token: string, after: string, limit) {
    const params = new URLSearchParams();
    params.append('type', 'artist');
    params.append('after', after);
    params.append('limit', limit.toString());
    const result = await fetch(
      'https://api.spotify.com/v1/me/following?' + params.toString(),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return await dto.ApiResult.create(result);
  }
}
