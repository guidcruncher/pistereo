import { Controller, Get, Logger, Post, Body, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import * as fs from 'fs';
import { Public } from '@auth/public.decorator';
import { MimeType } from 'mime-type';
import db from 'mime-db';

@Public()
@Controller('*')
export class AppController {
  private readonly log = new Logger(AppController.name);
  private readonly mimeType: MimeType = new MimeType(db);

  constructor(private readonly appService: AppService) {}

  @Get()
  async clientRequest(@Req() req, @Res() res) {
    try {
      const clientPath = process.env.PISTEREO_CLIENT_BASE ?? '';
      let requestPath = new URL('http://127.0.0.1' + req.url).pathname;

      if (requestPath == '/') {
        requestPath = '/index.html';
      }

      let filename = path.join(clientPath, requestPath);

      if (!fs.existsSync(filename)) {
        filename = path.join(clientPath, '/index.html');
      }

      let fileExtn: string = path.extname(filename);
      let contentType: string = this.mimeType.lookup(filename);

      let options = {};

      if (
        contentType.startsWith('text') ||
        contentType.includes('/json') ||
        contentType.includes('yaml') ||
        contentType.includes('javascript') ||
        contentType.includes('+xml')
      ) {
        options = { encoding: 'utf8' };
      }

      const stream = fs.createReadStream(filename, options);
      res.header('Content-Type', contentType);
      res.send(stream);
    } catch (err) {
      res.status(500).send();
    }
  }
}
