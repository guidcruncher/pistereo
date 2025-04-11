import { Logger, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export const SpotifyKey = 'IsSpotifyKey';
export const Spotify = () => SetMetadata(SpotifyKey, true);

@Injectable()
export class SpotifyResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  private removeProps(obj: any, args: string[]): any {
    let res = obj;
    if (res.href) {
      delete res.href;
    }
    if (res.available_markets) {
      delete res.available_markets;
    }
    const serializedObj = JSON.stringify(res, (key, value) => {
      if (!args.includes(key)) {
        return value;
      }
    });
    return JSON.parse(serializedObj);
  }

  private readonly log = new Logger(SpotifyResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isSpotify =
      this.reflector.getAllAndOverride<boolean>(SpotifyKey, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;

    if (!isSpotify) {
      return next.handle();
    }

    const statusCode = context.switchToHttp().getResponse().statusCode;
    const path = context.switchToHttp().getRequest().url;

    return next.handle().pipe(
      map((data) => {
        if (data) {
          if (data.status || data.error) {
            if (data.status) {
              context.switchToHttp().getResponse().status(data.status);
              let obj: any = data.result;
              if (obj) {
                obj = this.removeProps(obj, ['available_markets']);
              }
              return obj;
            } else {
              context.switchToHttp().getResponse().status(data.error.status);
              return data.error;
            }
          }
        }
        this.log.warn('No incoming data');
        return data;
      }),
    );
  }
}
