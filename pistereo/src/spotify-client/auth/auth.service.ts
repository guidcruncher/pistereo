import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as dto from '../dto';
import { scopes } from '../scopes';
import { PlayerService } from '../player/player.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly playerService: PlayerService,
  ) {}

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
    await this.postAuthTokenProcesses(body.access_token, body.refresh_token);
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
    await this.postAuthTokenProcesses(
      response.access_token,
      response.refresh_token,
    );
    return response;
  }

  private async updateLibRespotEnv(token: string) {
    const filename = this.config.get('librespot.envfile');

    if (!fs.existsSync(filename)) {
      this.log.warn(
        'Cannot update librespot token. Environment settings file not found at ' +
          filename,
      );
      return;
    }

    const data: string[] = [];
    let input: string[];

    if (fs.existsSync(filename)) {
      fs.copyFileSync(filename, filename + '.bak');
      input = fs.readFileSync(filename, 'utf8').toString().split('\n');
      var found: boolean = false;
      var disableFound: boolean = false;

      input.forEach((line) => {
        var newLine: string = line.trim();
        if (newLine.includes('LIBRESPOT_DISABLE_CREDENTIAL_CACHE=')) {
          if (!newLine.startsWith('#')) {
            newLine = '# ' + newLine;
          }
          disableFound = true;
        }

        if (newLine.includes('LIBRESPOT_ACCESS_TOKEN=')) {
          found = true;
          newLine = 'LIBRESPOT_ACCESS_TOKEN=' + token;
        }

        data.push(newLine);
      });

      if (!disableFound) {
        data.push('# Disable caching of credentials.');
        data.push('# LIBRESPOT_DISABLE_CREDENTIAL_CACHE=on');
      }

      if (!found) {
        data.push('# Spotify access token to sign in with.');
        data.push('LIBRESPOT_ACCESS_TOKEN=' + token);
      }
    } else {
      data.push('# Disable caching of credentials.');
      data.push('# LIBRESPOT_DISABLE_CREDENTIAL_CACHE=on');
      data.push('# Spotify access token to sign in with.');
      data.push('LIBRESPOT_ACCESS_TOKEN=' + token);
    }

    fs.writeFileSync(filename, data.join('\n'), 'utf8');
  }

  private async postAuthTokenProcesses(token: string, refreshToken: string) {
    if (!token || token == '') {
      this.log.warn('Token is empty, aborting update of token store.');
      return;
    }

    let settings: dto.PlayerSettings = new dto.PlayerSettings();
    let deviceName = this.config.get('spotify.playbackdevice');
    settings.accessToken = token;
    settings.refreshToken = refreshToken;
    settings.deviceId = await this.playerService.getDeviceIdByName(
      token,
      deviceName,
    );

    let filename = path.join(
      process.env.NODE_CONFIG_DIR ?? __dirname,
      'playbacksettings.json',
    );
    fs.writeFileSync(filename, JSON.stringify(settings));
    this.updateLibRespotEnv(token);
    return settings;
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
