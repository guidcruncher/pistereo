import { Injectable } from '@nestjs/common';
import * as cp from 'child_process';

@Injectable()
export class JackEqualiserService {
  async getControls(): Promise<any[]> {
    return await this.scontents();
  }

  async setControl(index: number, left: number, right: number) {
    return new Promise<any[]>((resolve, reject) => {
      this.getControls().then((controls) => {
        if (index <= controls.length) {
          this.sset(controls[index].name, left, right)
            .then(async (res) => {
              let state = await this.getControls();
              resolve(state);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject('Out of range');
        }
      });
    });
  }

  private sset(name: string, left: number, right: number) {
    return this.amixer([
      '-D',
      'equal',
      'sset',
      `"${name}"`,
      `${left},${right}`,
    ]);
  }

  private scontents(): Promise<any[]> {
    return this.amixer(['-D', 'equal', 'scontents']).then((res: string) =>
      this.parseSimpleControls(res),
    );
  }

  private amixer(params): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let stdout = '';
      let stderr = '';

      const amixer = cp.spawn('/usr/bin/amixer', params);

      amixer.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      amixer.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      amixer.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr));
        }
      });
    });
  }

  private parseSimpleControls(scontents: string): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      const data: any = [];
      let currentControl: any = null;
      scontents.split('\n').forEach((line) => {
        const matchControl = line.match(/^([^']+) '([^']+)',(\d+)$/);
        if (matchControl) {
          if (currentControl) {
            data.push(currentControl);
          }

          const [, type, name, index] = matchControl;
          currentControl = { type, name, index };

          return;
        }

        const matchValue = line.match(/^ {2}([^:]+): ?(.*)$/);
        if (matchValue) {
          const [, key, val] = matchValue;
          currentControl[key] = val;
        }
      });
      data.push(currentControl);
      data.map((m) => {
        let match = m.name.match(/(\d{2})\. (.*)/);
        if (match) {
          const [, num, name] = match;
          m.shortname = name;
          m.num = Number(num);
        }

        match = m['Front Left'].match(/^Playback (\d+) \[(\d+)%]/);
        if (match) {
          m.left = Number(match[2]);
        }

        match = m['Front Right'].match(/^Playback (\d+) \[(\d+)%]/);
        if (match) {
          m.right = Number(match[2]);
        }

        return m;
      });

      resolve(data);
    });
  }
}
