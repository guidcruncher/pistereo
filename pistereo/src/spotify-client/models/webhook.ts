import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsString, IsEmail } from 'class-validator';

export class PlayerWebhookData {
  @ApiProperty()
  playerEvent: string;
  @ApiProperty()
  trackId: string;
  @ApiProperty()
  oldTrackId: string;
  @ApiProperty()
  duration: number;
  @ApiProperty()
  progress: number;
  @ApiProperty()
  volume: number;
  @ApiProperty()
  volumePercent: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  uri: string;
  @ApiProperty()
  covers: string[];
}
