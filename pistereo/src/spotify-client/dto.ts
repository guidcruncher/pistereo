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
  positionMs: number = 0;
}

export class AuthorisationUrl {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  state: string;
}

export class UserProfile {
  @ApiProperty()
  country: string;
  @ApiProperty()
  display_name: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  @ApiProperty()
  external_urls: { spotify: string };
  @ApiProperty()
  followers: { href: string; total: number };
  @ApiProperty()
  @IsUrl()
  href: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  images: Image[];
  @ApiProperty()
  product: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  uri: string;
}

export class Image {
  @ApiProperty()
  @IsUrl()
  url: string;
  @ApiProperty()
  height: number;
  @ApiProperty()
  width: number;
}
