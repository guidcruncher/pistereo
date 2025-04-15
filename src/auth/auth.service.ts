import { SpotifyBaseService } from '../spotify-client/spotify-base.service';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { scopes } from './scopes';
import { UserService } from '@data/user/user.service';

@Injectable()
export class AuthService extends SpotifyBaseService {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    super();
  }

  private readonly log = new Logger(AuthService.name);

  public async getAuthorisationUrl(
    clientId: string,
    state: string,
    redirectUrl: string,
  ): Promise<any> {
    this.log.log(this.__caller() + ' =>getAuthorisationUrl');
    const verifier = state == '' ? this.generateCodeVerifier(128) : state;

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('response_type', 'code');
    params.append('redirect_uri', redirectUrl);

    params.append('scope', scopes.join(' '));
    params.append('state', verifier);

    const result: any = {
      url: `https://accounts.spotify.com/authorize?${params.toString()}`,
      state: verifier,
    };
    return result;
  }

  public async getAccessToken(
    clientId: string,
    clientSecret: string,
    code: string,
    verifier: string,
    grantType: string = 'authorization_code',
    redirectUri: string = '',
  ): Promise<any> {
    this.log.log(this.__caller() + ' =>getAccessToken');
    const params = new URLSearchParams();
    params.append('grant_type', grantType);
    params.append('code', code);
    params.append(
      'redirect_uri',
      redirectUri == ''
        ? this.config.get('host.baseurl') + '/api/auth/callback'
        : redirectUri,
    );
    params.append('code_verifier', verifier);

    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
      body: params,
    });

    const body = await result.json();
    await this.postAuthTokenProcesses(body.access_token, body.refresh_token);
    return body;
  }

  public async getRefreshToken(
    clientid: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<any> {
    this.log.log(this.__caller() + ' =>getRefreshToken');
    const url = 'https://accounts.spotify.com/api/token';

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + accessToken,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientid,
      }),
    };

    const body = await fetch(url, payload);
    const response = await body.json();
    await this.postAuthTokenProcesses(
      response.access_token,
      response.refresh_token,
    );
    return response;
  }

  private async fetchMyProfile(token: string): Promise<any> {
    this.log.log(this.__caller() + ' =>fetchMyprofile');
    const result = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    return await result.json();
  }

  private async postAuthTokenProcesses(
    token: string,
    refreshToken: string,
    oldtoken: string = '',
  ) {
    this.log.log(this.__caller() + ' =>PostAuthTokenProcesses');
    if (!token || token == '') {
      this.log.warn('Token is empty, aborting update of token store.');
      return;
    }

    const user: any = await this.fetchMyProfile(token);

    if (oldtoken != '') {
      await this.userService.deleteUserByToken(oldtoken);
    }

    await this.userService.updateUser(
      user.display_name,
      user.id,
      user,
      token,
      refreshToken,
    );
  }

  private generateCodeVerifier(length: number) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private async generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
