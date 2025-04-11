
module.exports = {
  apps : [
  {
    name   : "Server",
    cwd    : "/pistereo/app",
    script : "nest",
    args   : "start --watch",
    env_production: {
       NODE_ENV: "production",
       BASE: '/pistereo',
       NODE_CONFIG_DIR: '/pistereo/app/config',
       PISTEREO_CLIENT_BASE: '/pistereo/app/dist/client',
       MPV_SOCKET: '/pistereo/mediaserver/socket/mpv',
       LIBRESPOT_HOST: 'http://127.0.0.1:3678',
       LIBRESPOT_WS: 'ws://127.0.0.1:3678',
       APPCACHE: '/cache/app'
    },
    env_development: {
       NODE_ENV: "development",
       BASE: '/pistereo',
       NODE_CONFIG_DIR: '/pistereo/app/config',
       PISTEREO_CLIENT_BASE: '/pistereo/app/dist/client',
       MPV_SOCKET: '/pistereo/mediaserver/socket/mpv',
       LIBRESPOT_HOST: 'http://127.0.0.1:3678',
       LIBRESPOT_WS: 'ws://127.0.0.1:3678',
       APPCACHE: '/cache/app'
    }
  },
  {
    name   : "Client",
    cwd    : "/pistereo/app",
    script : "npm",
    args   : "run client-dev-build",
  },
  {
    name   : "Librespot",
    cwd    : "/pistereo/app/provisioning",
    script : "librespot.sh",
    env_production: {
       BASE: '/pistereo',
    },
    env_development: {
       BASE: '/pistereo',
    }
  },
  {
    name   : "MPV",
    cwd    : "/pistereo/app/provisioning",
    script : "mpv.sh",
    env_production: {
       BASE: '/pistereo',
       MPV_SOCKET: '/pistereo/mediaserver/socket/mpv',
    },
    env_development: {
       BASE: '/pistereo',
       MPV_SOCKET: '/pistereo/mediaserver/socket/mpv',
    }
  }
  ]
}
