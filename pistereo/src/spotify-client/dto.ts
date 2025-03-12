import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsString, IsEmail } from 'class-validator';

export interface oAuthResponse {
  grant_type: string;
  code: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

export class ApiResult {
  status: number;
  statusText: string;
  result: any;

  public render(res) {
    if (this.status == 204) {
      res.status(this.status).send();
    } else {
      res.status(this.status).send(this.result);
    }
  }

  public static async create(result) {
    let res: ApiResult = new ApiResult();
    res.status = result.status;
    res.statusText = result.statusText;

    if (res.status != 204) {
      try {
        res.result = await result.json();
      } catch (err) {
        res.result = { error: { status: res.status, message: res.statusText } };
      }
    }

    return res;
  }
}

export class PlaybackRequest {
  @ApiProperty()
  deviceId: string;
  @ApiProperty()
  contextUri: string;
  @ApiProperty()
  uris: string[];
  @ApiProperty()
  positionMs: number = 0;
}

export class SearchRequest {
  @ApiProperty()
  q: string;

  @ApiProperty({
    example: [
      'album',
      'artist',
      'playlist',
      'track',
      'show',
      'episode',
      'audiobook',
    ],
    type: Array,
    required: true,
  })
  types: string[];

  @ApiProperty()
  market: string;
}

export class AuthorisationUrl {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  state: string;
}

export class PlayerSettings {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  deviceId: string;
}
