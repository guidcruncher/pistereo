import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsString, IsEmail } from 'class-validator';

export class AuthorisationUrl {
  @ApiProperty()
  @IsUrl()
  url: string;
  @ApiProperty()
  state: string;
}
