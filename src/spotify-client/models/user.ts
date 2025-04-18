import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class AuthorisationUrl {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  state: string;
}
