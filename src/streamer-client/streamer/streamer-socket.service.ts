import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import * as util from 'util';
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
export class StreamerSocketService
  extends ServiceBase
  implements OnModuleDestroy
{
  private readonly log = new Logger(StreamerSocketService.name);
  private static socket: net.Socket;

  constructor(private readonly eventEmitter: EventEmitter2) {
    super();
    StreamerSocketService.ensureSocket(this.log, eventEmitter);
  }

  public static ensureSocket(log: Logger, eventEmitter: EventEmitter2) {
    if (StreamerSocketService.socket) {
      log.warn('Socket already setup');
      return;
    }
    StreamerSocketService.socket = new net.Socket();
    StreamerSocketService.socket.setEncoding('utf-8');

    StreamerSocketService.socket.on('error', (error) => {
      log.error('Error in Streamer socket', error);
    });

    StreamerSocketService.socket.on('close', (state) => {
      log.warn('Streamer socket closed', state);
    });

    StreamerSocketService.socket.on('data', (data) => {
      try {
        let json: any = JSON.parse(data.toString());
        let ev: any = { type: 'streamer.' + json.event, data: json };
        if (json.event != 'metadata-update') {
          log.log('Emitting ' + data);
        }

        eventEmitter.emit('streamer.event', {
          name: ev.type,
          fired: new Date().toISOString(),
          payload: ev,
          randomNumber: Math.random(),
        });
      } catch (err) {
        //        log.warn('Cannot parse streamer message: ' + data, err);
      }
    });
    StreamerSocketService.socket.connect(
      { path: process.env.MPV_SOCKET as string },
      () => {
        log.debug('Socket connection to ' + process.env.MPV_SOCKET + ' open');
      },
    );
  }

  private async emitEvent(name: string, payload: any) {
    this.eventEmitter.emit('streamer.event', {
      name: name,
      fired: new Date().toISOString(),
      payload: payload,
      randomNumber: Math.random(),
    });
  }

  public onModuleDestroy() {
    this.log.debug('Closing socket on module destroy');
    StreamerSocketService.socket.destroy();
  }

  private async sendSocketCommand(
    requestId: number,
    cmd: string,
    parameters: any[] = [],
  ): Promise<any> {
    let commandText: any[] = [cmd];
    commandText = commandText.concat(parameters);
    let json: string = JSON.stringify({
      command: commandText,
      request_id: requestId,
    });
    this.log.debug('sendSocketCommand ' + json);
    await StreamerSocketService.socket.write(json, 'utf8', (res) => {});
  }
}
