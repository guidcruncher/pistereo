import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import * as util from 'util';
import { ConfigService } from '@nestjs/config';
import * as net from 'net';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceBase } from '@/service-base';

const exec = util.promisify(require('node:child_process').exec);

const errorCodes: Record<string, number> = {
  success: 200,
  'property not found': 404,
  'property unavailable': 400,
};

@Injectable()
export class StreamerService extends ServiceBase {
  private readonly log = new Logger(StreamerService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  private async emitEvent(name: string, payload: any) {
    this.log.log(
      this.__caller() +
        ' => emitEvent ' +
        name +
        ' ' +
        JSON.stringify(payload ?? {}),
    );
    this.eventEmitter.emit('streamer.event', {
      name: name,
      fired: new Date().toISOString(),
      payload: payload,
      randomNumber: Math.random(),
    });
  }

  public async sendCommand(cmd: string, parameters: any[] = []): Promise<any> {
    let commandText: any[] = [cmd];
    commandText = commandText.concat(parameters);
    let jsonCmd: string = JSON.stringify({ command: commandText });
    let socket: string = process.env.MPV_SOCKET as string;
    let cmdText: string = "echo '" + jsonCmd + "' | socat - " + socket;
    this.log.log(this.__caller() + ' => sendCommand ' + jsonCmd);

    return new Promise((resolve, reject) => {
      if (cmd == 'get_property' && parameters.length > 0) {
        if (parameters[0] == '') {
          this.log.error(
            'ERROR ' + this.__caller() + ' Missing property name => ' + jsonCmd,
          );
          reject();
          return;
        }
      }

      exec(cmdText)
        .then((result) => {
          let json: any = JSON.parse(result.stdout);
          if (json.error) {
            json.statusCode = errorCodes[json.error] ?? 500;
            json.command = jsonCmd;
            json.caller = this.__caller();
            resolve(json);
          } else {
            resolve(json);
          }
        })
        .catch((err) => {
          this.log.error('Error executing command ' + cmdText, err);
          reject(err);
        });
    });
  }

  public async getStatus() {
    let result: any = {
      playing: false,
      active: false,
      url: '',
      volume: 0,
      position: 0.0,
    };
    this.log.log(this.__caller() + ' => getStatus');
    let pathProp = await this.sendCommand('get_property', ['path']);
    let volProp = await this.sendCommand('get_property', ['volume']);
    let metaData = await this.sendCommand("get_property", ["metadata"]);
    let playbackProp = await this.sendCommand('get_property', [
      'playback-time',
    ]);
    let idleProp = await this.sendCommand('get_property', ['core-idle']);

    if (playbackProp && playbackProp.statusCode == 200) {
      result.position = playbackProp.data;
    }

   if (metaData && metaData.statusCode == 200) {
     result.metadata = metaData.data;
   }
    if (idleProp && idleProp.statusCode == 200) {
      result.playing = !idleProp.data;
    }

    if (pathProp && pathProp.statusCode == 200) {
      result.active = true;
      result.url = pathProp.data;
    }
    if (volProp && volProp.statusCode == 200) {
      result.volume = volProp.data;
    }

    return result;
  }

  public async stop() {
    this.log.log(this.__caller() + ' => stop');
    return await this.sendCommand('stop', []);
  }

  public async play(url: string) {
    this.log.log(this.__caller() + ' => play');
    let state: any = await this.getStatus();

    if (!state.active) {
      this.eventEmitter.emit('jack.input_changes', 'streamer');
    }
    return await this.sendCommand('loadfile', [url, 'replace']);
  }
}
