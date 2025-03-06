import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as dto from '../dto';
import { scopes } from '../scopes';

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  private readonly log = new Logger(AuthService.name);

  public async getAuthorisationUrl(
    clientId: string,
    state: string,
    redirectUrl: string,
  ): Promise<dto.AuthorisationUrl> {
    const verifier = state == '' ? this.generateCodeVerifier(128) : state;

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('response_type', 'code');
    params.append('redirect_uri', redirectUrl);

    params.append('scope', scopes.join(' '));
    params.append('state', verifier);

    const result: dto.AuthorisationUrl = {
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
    const params = new URLSearchParams();
    params.append('grant_type', grantType);
    params.append('code', code);
    params.append(
      'redirect_uri',
      redirectUri == ''
        ? this.config.get('host.baseurl') + '/api/auth/redirect'
        : redirectUri,
    );
    params.append('code_verifier', verifier!);

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
    return body;
  }

  public async getRefreshToken(
    clientid: string,
    refreshToken: string,
  ): Promise<any> {
    const url = 'https://accounts.spotify.com/api/token';

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientid,
      }),
    };

    const body = await fetch(url, payload);
    const response = await body.json();
    return response;
  }

  private generateCodeVerifier(length: number) {
    let text = '';
    let possible =
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
