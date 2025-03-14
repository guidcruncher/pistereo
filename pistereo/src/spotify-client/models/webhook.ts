import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsString, IsEmail } from 'class-validator';

export class PlayerWebhookData {
  @ApiProperty()
  playerEvent: string;
  @ApiProperty()
  trackId: string;
  @ApiProperty()
  oldTrackId: string;
}
