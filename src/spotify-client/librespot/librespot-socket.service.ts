import { Injectable, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import * as util from 'util';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SpotifyBaseService } from '../spotify-base.service';
import { GetStatusResponse, Play } from '../spotify-client.d';
import { UserService } from '@data/user/user.service';
import { LibrespotService } from './librespot.service';

@Injectable()
export class LibrespotSocketService extends SpotifyBaseService {
  private static socket: WebSocket;
  private readonly log = new Logger(LibrespotSocketService.name);

  private lastMessage: string = '';

  constructor(
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
    private readonly libRespotService: LibrespotService,
  ) {
    super();
    LibrespotSocketService.ensureSocket(
      this.log,
      eventEmitter,
      userService,
      libRespotService,
    );
  }

  public static ensureSocket(
    log: Logger,
    eventEmitter: EventEmitter2,
    userService: UserService,
    libRespotService: LibrespotService,
  ) {
    if (LibrespotSocketService.socket != null) {
      log.error('Socket already established');
      return;
    }

    LibrespotSocketService.socket = new WebSocket(
      process.env.LIBRESPOT_WS + '/events',
    );

    LibrespotSocketService.socket.on('open', () => {
      log.debug('Socket connection to ' + process.env.LIBRESPOT_WS + ' open.');
    });

    LibrespotSocketService.socket.on('message', (message) => {
      const messageText: string = message.toString().trim();
      try {
        log.debug('Message => ' + messageText);
        const ev: any = JSON.parse(messageText);
        ev.type = 'spotify.' + ev.type;

        if (ev.type == 'spotify.metadata') {
          libRespotService.getStatus().then((state: any) => {
            userService.updateLastPlayed(
              state ? state.username : '',
              '',
              'spotify',
              ev.data.uri,
              {
                source: 'spotify',
                uri: ev.data.uri,
                name: ev.data.name,
                description: ev.data.album_name,
                owner: ev.data.artist_names.join(' '),
                image: ev.data.album_cover_url,
              },
            );
          });
        }

        log.debug('Emitting event ' + ev.type);

        eventEmitter.emit('player.event', {
          name: ev.type,
          fired: new Date().toISOString(),
          payload: ev,
          randomNumber: Math.random(),
        });
      } catch (err) {
        log.error('Unable to process socket message ' + messageText, err);
      }
    });

    LibrespotSocketService.socket.on('close', (code, reason) => {
      log.warn(
        '$ocket connection to ' + process.env.LIBRESPOT_WS + ' closed.',
        code,
        reason,
      );
    });

    LibrespotSocketService.socket.on('error', (error) => {
      log.error(
        'Error on $ocket connection to ' + process.env.LIBRESPOT_WS + ' .',
        error,
      );
    });
  }

  private async emitEvent(name: string, payload: any) {
    this.eventEmitter.emit('player.event', {
      name: name,
      fired: new Date().toISOString(),
      payload: payload,
      randomNumber: Math.random(),
    });
  }

  private sendMessage(data: any) {
    this.log.log(this.__caller() + ' =>sendMessage');
    LibrespotSocketService.socket.send(data);
  }
}
