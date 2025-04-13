export const scopes: string[] = [
  'streaming',
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-private',
  'playlist-read-private',
  'user-read-recently-played',
  'user-follow-read',
  'user-library-read',
  'user-top-read',
];

export const getScopes = (): Record<string, any> => {
  const r: Record<string, any> = {};

  scopes.forEach((scope) => {
    r[scope] = scope;
  });

  return r;
};
