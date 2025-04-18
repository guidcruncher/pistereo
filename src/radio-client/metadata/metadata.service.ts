import { NotFoundException, Injectable } from '@nestjs/common';
import * as htmlparser2 from 'htmlparser2';
import { Readable } from 'node:stream';

@Injectable()
export class MetadataService {
  public async getMediaIcon(name: string) {
    let url: string = await this.getMediaIconUrl(name);

    if (url === '') {
      throw new NotFoundException();
    }

    const result = await fetch(url, { method: 'GET' });

    if (!result.ok) {
      throw new NotFoundException();
    }

    return result.body;
  }

  public async getMediaIconUrl(name: string): Promise<string> {
    let id: string = name.replaceAll(' ', '-').toLowerCase();
    let url: string = 'https://media.info/radio/stations/' + id;
    let iconurl: string = '';
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
