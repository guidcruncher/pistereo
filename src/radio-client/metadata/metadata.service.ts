import { Injectable, NotFoundException } from '@nestjs/common';
import * as htmlparser2 from 'htmlparser2';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { default as stream } from 'node:stream';
import type { ReadableStream } from 'node:stream/web';
import { finished } from 'stream/promises';

@Injectable()
export class MetadataService {
  public async getMediaIcon(name: string) {
    const id: string = name.replaceAll(' ', '-').toLowerCase();
    if (name === '') {
      throw new NotFoundException();
    }

    let baseDir = path.join(process.env.APPCACHE as string, 'icons');
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
    }
    const filename = path.join(
      baseDir,
      crypto.createHash('md5').update(id).digest('hex') + '.png',
    );

    if (fs.existsSync(filename)) {
      return fs.readFileSync(filename);
    }

    const download = async (url, fileName) => {
      const res = await fetch(url);
      const destination = fileName;
      const fileStream = fs.createWriteStream(destination, { flags: 'wx' });
      await finished(
        stream.Readable.fromWeb(res.body as ReadableStream<Uint8Array>).pipe(
          fileStream,
        ),
      );
    };

    let url: string = await this.getMediaIconUrl(id);

    if (url == '') {
      throw new NotFoundException();
    }

    await download(url, filename);
    return fs.readFileSync(filename);
  }

  public async getMediaIconApiUrl(name: string): Promise<string> {
    const id: string = name.replaceAll(' ', '-').toLowerCase();
    let url: string =
      '/api/radio/metadata/icon?query=' + encodeURIComponent(id);
    return url;
  }

  public async getMediaIconUrl(name: string): Promise<string> {
    const id: string = name.replaceAll(' ', '-').toLowerCase();
    const url: string = 'https://media.info/radio/stations/' + id;
    let iconurl = '';
    const result = await fetch(url, { method: 'GET' });

    if (!result.ok) {
      return '';
    }

    const html = await result.text();

    const parser = new htmlparser2.Parser({
      onopentag(name, attributes) {
        if (name === 'meta' && attributes.property === 'og:image') {
          iconurl = 'https://media.info' + attributes.content;
        }
      },
    });
    parser.write(html);
    parser.end();

    return iconurl;
  }
}
