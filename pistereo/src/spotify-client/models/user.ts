import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsString, IsEmail } from 'class-validator';

export class AuthorisationUrl {
  @ApiProperty()
  @IsUrl()
  url: string;
  @ApiProperty()
  state: string;
}

export class PublicUser {
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
