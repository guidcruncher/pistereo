interface PublicUser {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: { spotify: string };
  followers: { href: string; total: number };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface DeviceObject {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
  supports_volume: boolean;
}

interface PagedList<T> {
  href: string;
  limit: number;
  next: any;
  offset: number;
  previous: any;
  total: number;
  items: T[];
}

interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: Externalurls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: any;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}

interface Tracks {
  href: string;
  total: number;
}

interface Owner {
  display_name: string;
  external_urls: Externalurls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface Externalurls {
  spotify: string;
}

interface Station {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  iso_3166_2: string;
  state: string;
  language: string;
  languagecodes: string[];
  votes: number;
  lastchangetime: string;
  lastchangetime_iso8601: string;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  lastchecktime: string;
  lastchecktime_iso8601: string;
  lastcheckoktime: string;
  lastcheckoktime_iso8601: string;
  lastlocalchecktime: string;
  lastlocalchecktime_iso8601: string;
  clicktimestamp: string;
  clicktimestamp_iso8601: string;
  clickcount: number;
  clicktrend: number;
  ssl_error: number;
  geo_lat: number;
  geo_long: number;
  geo_distance: number;
  has_extended_info: boolean;
}

interface StationSearchRequest {
  name: string;
  nameExact: boolean;
  country: string;
  countrycode: string;
  language: string;
  tagList: string[];
  codec: string;
  bitrateMin: number;
  bitrateMax: number;
}

interface RadioPreset {
  id: string;
  stationuuid: string;
  name: string;
  image: string;
  info: Station;
}
