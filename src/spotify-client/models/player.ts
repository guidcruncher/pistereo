import { ApiProperty } from '@nestjs/swagger';

export class DeviceTransferRequest {
  @ApiProperty()
  device_ids: string[];

  @ApiProperty()
  play: boolean;
}

export class PlayerSettings {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  deviceId: string;
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

export class DefaultPlaybackRequest {
  @ApiProperty()
  contextUri: string;

  @ApiProperty()
  uris: string[];

  @ApiProperty()
  positionMs: number = 0;
}
