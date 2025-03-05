import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dto from '../dto';

@Injectable()
export class ProfileService {
  constructor(private readonly config: ConfigService) {}

  private readonly log = new Logger(ProfileService.name);

  public async fetchProfile(token: string): Promise<dto.UserProfile> {
    this.log.debug(token);
    const result = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    return await result.json();
  }
}
