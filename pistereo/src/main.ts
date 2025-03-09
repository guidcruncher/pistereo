import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import secureSession from '@fastify/secure-session';
import { scopes, getScopes } from './spotify-client/scopes';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
    }),
    {
      logger: new ConsoleLogger({
        colors: true,
        timestamp: true,
        json: false,
      }),
    },
  );

  app.setGlobalPrefix('api');

  const config: ConfigService = app.get(ConfigService);
  const appService: AppService = app.get(AppService);
  const log = new Logger('Bootstrap');
  const nodeEnv: string = process.env.NODE_ENV ?? 'development';
  log.log('Running in ' + nodeEnv + ' mode.');
  log.log("Client application running in : " + (process.env.PISTEREO_CLIENT_BASE ?? ""));


  app.enableShutdownHooks();

  await app.register(secureSession, {
    secret: appService.generateRandomString(64),
    salt: appService.generateRandomString(16),
  });

  app.enableCors();
  const baseUrl = config.get('host.baseurl');

  const documentConfig = new DocumentBuilder()
    .setTitle('PiStereo')
    .setDescription('The PiStereo API description')
    .setVersion('1.0')
    .addOAuth2(
      {
        type: 'oauth2',
        scheme: 'bearer',
        in: 'header',
        flows: {
          authorizationCode: {
            authorizationUrl: baseUrl + '/api/auth',
            tokenUrl: baseUrl + '/api/auth/token',
            refreshUrl: baseUrl + '/api/auth/refresh',
            //            authorizationUrl: 'https://accounts.spotify.com/authorize',
            //            tokenUrl: 'https://accounts.spotify.com/api/token',
            //            refreshUrl: 'https://accounts.spotify.com/api/token',
            scopes: getScopes(),
          },
        },
      },
      'Access Token',
    )
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api/docs/', app, documentFactory, {
    swaggerOptions: {
      initOAuth: {
        clientId: config.get('spotify.clientid'),
        clientSecret: config.get('spotify.clientsecret'),
      },
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
