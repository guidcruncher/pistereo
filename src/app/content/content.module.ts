import { ServeStaticModule } from '@nestjs/serve-static';
import { ContentController } from './content.controller';
import { DynamicModule } from '@nestjs/common';

export class ContentModule {
  static async forRootAsync(): Promise<DynamicModule> {
    if (process.env.NODE_ENV == 'development') {
      return {
        module: ContentModule,
        providers: [],
        controllers: [ContentController],
        exports: [],
      };
    }

    return {
      module: ContentModule,
      imports: [
        ServeStaticModule.forRoot({
          rootPath: process.env.PISTEREO_CLIENT_BASE,
          serveStaticOptions: { maxAge: 0, fallthrough: true },
        }),
      ],
      providers: [],
      controllers: [],
      exports: [],
    };
  }
}
