import { getScopes } from '@auth/scopes';
import compression from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import secureSession from '@fastify/secure-session';
import { ConsoleLogger, LogLevel } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
    }),
  );

  const config: ConfigService = app.get(ConfigService);

  app.useLogger(
    new ConsoleLogger({
      prefix: 'server',
      logLevels: config.get<LogLevel[]>('logging.loglevels') ?? [
        'log',
        'error',
        'warn',
        'debug',
        'verbose',
      ],
      colors: true,
      timestamp: true,
      json: false,
    }),
  );

  const appService: AppService = app.get(AppService);
  const log = new Logger('Bootstrap');
  const nodeEnv: string = process.env.NODE_ENV ?? 'development';
  log.log('Running in ' + nodeEnv + ' mode.');
  log.log(
    'Client application running in : ' +
      (process.env.PISTEREO_CLIENT_BASE ?? ''),
  );

  app.enableShutdownHooks();

  app.register(fastifyCookie);

  await app.register(secureSession, {
    secret: config.get('host.secret') as string,
    salt: 'mq9hDxBVDbspDR6n',
  });

  await app.register(compression, { encodings: ['gzip', 'deflate'] });
  app.enableCors();
  const baseUrl = config.get('host.baseurl');

  const documentConfig = new DocumentBuilder()
    .setTitle('PiStereo')
    .setDescription(
      'The PiStereo API. Click to download OpenAPI Document in <a href="/api/docs-json">JSON</a> or <a href="/api/docs-yaml">YAML</a>.',
    )
    .setVersion('1.0')
    .addOAuth2(
      {
        type: 'oauth2',
        scheme: 'bearer',
        in: 'header',
        flows: {
          authorizationCode: {
            authorizationUrl: baseUrl + '/api/auth',
            tokenUrl: baseUrl + '/api/auth/callback',
            refreshUrl: baseUrl + '/api/auth/refresh',
            scopes: getScopes(),
          },
        },
      },
      'Api',
    )
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      initOAuth: {
        clientId: config.get('spotify.clientid'),
        clientSecret: config.get('spotify.clientsecret'),
      },
      ui: true,
      explorer: true,
    },
  });

  const listenPort =
    config.get('host.listen.port') ?? process.env.LISTEN_PORT ?? 3000;
  const listenHost =
    config.get('host.listen.host') ?? process.env.LISTEN_HOST ?? '0.0.0.0';

  log.log('Server listening on http://' + listenHost + ':' + listenPort);
  appService.setApp(app);
  await app.listen(listenPort, listenHost);
}

bootstrap();
