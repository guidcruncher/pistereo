// This file is auto-generated by @hey-api/openapi-ts

/**
 * A track
 */
export interface Track {
  /**
   * URI
   */
  uri?: string;
  /**
   * Name
   */
  name?: string;
  /**
   * Artists name
   */
  artist_names?: Array<unknown>;
  /**
   * Album name
   */
  album_name?: string;
  /**
   * Album cover URL
   */
  album_cover_url?: string;
  /**
   * Duration in milliseconds
   */
  duration?: number;
}

/**
 * An initiate playback payload
 */
export interface Play {
  /**
   * Spotify URI to start playing
   */
  uri?: string;
  /**
   * Spotify URI to skip to (when playing playlists)
   */
  skip_to_uri?: string;
  /**
   * Start playback as paused
   */
  paused?: boolean;
}

export class GetStatusResponse {
  /**
   * Currently active account's username
   */
  username?: string;
  /**
   * The player device ID
   */
  device_id?: string;
  /**
   * The player device name
   */
  device_name?: string;
  /**
   * Who started the playback, "go-librespot" identifies the API as the play origin, everything else is Spotify own stuff
   */
  play_origin?: string;
  /**
   * Whether the player is stopped
   */
  stopped?: boolean;
  /**
   * Whether the player is paused
   */
  paused?: boolean;
  /**
   * Whether the player is buffering
   */
  buffering?: boolean;
  /**
   * The player current volume from 0 to max
   */
  volume?: number;
  /**
   * The player max volume value
   */
  volume_steps?: number;
  /**
   * Whether the repeat context feature is enabled
   */
  repeat_context?: boolean;
  /**
   * Whether the repeat track feature is enabled
   */
  repeat_track?: boolean;
  /**
   * Whether the shuffle context feature is enabled
   */
  shuffle_context?: boolean;
  track?: Track;
}

export interface PostPlayerPlayData {
  body?: never;
  path?: never;
  query?: never;
  url: '/player/play';
}

export interface PostPlayerPlayResponse {
  /**
   * Successful response
   */
  200: unknown;
}

export interface PostPlayerResumeData {
  body?: never;
  path?: never;
  query?: never;
  url: '/player/resume';
}

export interface PostPlayerResumeResponse {
  /**
   * Successful response
   */
  200: unknown;
}

export interface PostPlayerPauseData {
  body?: never;
  path?: never;
  query?: never;
  url: '/player/pause';
}

export interface PostPlayerPauseResponse {
  /**
   * Successful response
   */
  200: unknown;
}

export interface PostPlayerPlaypauseData {
  body?: never;
  path?: never;
  query?: never;
  url: '/player/playpause';
}

export interface PostPlayerPlaypauseResponse {
  /**
   * Successful response
   */
  200: unknown;
}

export interface PostPlayerNextData {
  body?: {
    /**
     * The track URI to skip to
     */
    uri?: string;
  };
  path?: never;
  query?: never;
  url: '/player/next';
}

export interface PostPlayerNextResponse {
  /**
   * Successful response
   */
  200: unknown;
}

export interface PostPlayerPrevData {
  body?: never;
  path?: never;
  query?: never;
  url: '/player/prev';
}

export interface PostPlayerPrevResponse {
  /**
   * Successful response
   */
  200: unknown;
}

export interface PostPlayerSeekData {
  body?: {
    /**
     * Seek position in milliseconds
     */
    position: number;
    /**
     * Whether the seek position is relative to the current one
     */
    relative?: boolean;
  };
  path?: never;
  query?: never;
  url: '/player/seek';
}

export interface PostPlayerSeekResponse {
  /**
   * Successful response
   */
  200: unknown;
}

export interface GetPlayerVolumeData {
  body?: never;
  path?: never;
  query?: never;
  url: '/player/volume';
}

export interface GetPlayerVolumeResponse {
  /**
   * Returns the player volume settings
   */
  200: {
    /**
     * The current volume, ranging from 0 to max
     */
    value?: number;
    /**
     * The max volume value
     */
    max?: number;
  };
}

export interface PostPlayerVolumeData {
  body?: {
    /**
     * Volume from 0 to max
     */
    volume: number;
    /**
     * Whether to change the volume relative to the current volume
     */
    relative?: boolean;
  };
  path?: never;
  query?: never;
  url: '/player/volume';
}

export interface PostPlayerVolumeResponse {
  /**
   * Successful response
   */
  200: unknown;
}

export interface PostPlayerRepeatContextData {
  body?: {
    /**
     * Whether repeating context should be enabled
     */
    repeat_context: boolean;
  };
  path?: never;
  query?: never;
  url: '/player/repeat_context';
}

export interface PostPlayerRepeatContextResponse {
  /**
   * Successful response
   */
  200: unknown;
}

export interface PostPlayerRepeatTrackData {
  body?: {
    /**
     * Whether repeating track should be enabled
     */
    repeat_track: boolean;
  };
  path?: never;
  query?: never;
  url: '/player/repeat_track';
}

export interface PostPlayerRepeatTrackResponse {
  /**
   * Successful response
   */
  200: unknown;
}

export interface PostPlayerShuffleContextData {
  body?: {
    /**
     * Whether shuffling context should be enabled
     */
    shuffle_context: boolean;
  };
  path?: never;
  query?: never;
  url: '/player/shuffle_context';
}

export interface PostPlayerShuffleContextResponse {
  /**
   * Successful response
   */
  200: unknown;
}

export interface PostPlayerAddToQueueData {
  body?: {
    /**
     * The URI for the track that should be added
     */
    uri: string;
  };
  path?: never;
  query?: never;
  url: '/player/add_to_queue';
}

export interface PostPlayerAddToQueueResponse {
  /**
   * Successful response
   */
  200: unknown;
}
