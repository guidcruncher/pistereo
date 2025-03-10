import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import * as fs from 'fs';
import { Public } from './spotify-client/auth/public.decorator';
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
    const clientPath = process.env.PISTEREO_CLIENT_BASE ?? '';
    let requestPath = new URL('http://127.0.0.1' + req.url).pathname;

    if (requestPath == '/') {
      requestPath = '/index.html';
    }

    let filename = path.join(clientPath, requestPath);

    if (!fs.existsSync(filename)) {
      this.log.log('404 ' + filename);
      res.status(404).send();
      return;
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

    this.log.log('200 ' + filename);
    const stream = fs.createReadStream(filename, options);
    res.header('Content-Type', contentType);
    res.send(stream);
  }
}
