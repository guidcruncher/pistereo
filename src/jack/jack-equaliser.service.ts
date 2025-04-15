import { Logger, Injectable } from '@nestjs/common';
import * as cp from 'child_process';
import { ServiceBase } from '@/service-base';

@Injectable()
export class JackEqualiserService extends ServiceBase {
  private readonly log = new Logger(JackEqualiserService.name);

  async getControls(): Promise<any[]> {
    this.log.log(this.__caller() + ' => getControls');
    return await this.scontents();
  }

  resetControls(level: number): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.scontents().then((ctrls) => {
        let p: Promise<any>[] = [];
        for (var i = 0; i < ctrls.length; i++) {
          p.push(this.sset(ctrls[i].name, level, level));
        }

        Promise.allSettled(p)
          .then(() => {
            this.getControls()
              .then((res) => {
                resolve(res);
              })
              .catch((err) => {
                this.log.error('Error resetting equaliser', err);
                reject(err);
              });
          })
          .catch((err) => {
            this.log.error('Error resetting equaliser', err);
            reject(err);
          });
      });
    });
  }

  async setControl(index: number, left: number, right: number) {
    this.log.log(this.__caller() + ' => setControl');
    return new Promise<any[]>((resolve, reject) => {
      this.getControls().then((controls) => {
        let ctrl: any = controls.find((c) => {
          return c.num == index;
        });
        if (ctrl) {
          this.sset(ctrl.name, left, right)
            .then(async (res) => {
              let state = await this.getControls();
              resolve(state);
            })
            .catch((err) => {
              this.log.error('Error in setControl', err);
              reject(err);
            });
        } else {
          this.log.error('Out of range', index);
          reject('Out of range');
        }
      });
    });
  }

  private sset(name: string, left: number, right: number) {
    this.log.log(this.__caller() + ' => sset');
    return this.amixer([
      '-D',
      'equal',
      'sset',
      `"${name}"`,
      `${left},${right}`,
    ]);
  }

  private scontents(): Promise<any[]> {
    this.log.log(this.__caller() + ' => scontents');
    return this.amixer(['-D', 'equal', 'scontents']).then((res: string) =>
      this.parseSimpleControls(res),
    );
  }

  private amixer(params): Promise<string> {
    this.log.log(this.__caller() + ' => amixer');
    return new Promise<string>((resolve, reject) => {
      let stdout = '';
      let stderr = '';

      this.log.log('Spawn => /usr/bin/amixer ' + params.join(' '));
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
          this.log.error('Error spawning amixer', stderr);
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
