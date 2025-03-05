import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export const SpotifyKey = 'SpotifyKey';
export const Spotify = () => SetMetadata(SpotifyKey, true);

@Injectable()
export class SpotifyResponseInterceptor
  implements NestInterceptor
{
  constructor(private reflector: Reflector) {}

intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
let isSpotify=   this.reflector.get<boolean>(SpotifyKey, context.getHandler()) ?? false;
console.log(isSpotify);
    if (!isSpotify) {
      return next.handle();
    }

    const statusCode = context.switchToHttp().getResponse().statusCode;
    const path = context.switchToHttp().getRequest().url;

    return next.handle().pipe(
      map((data) => {
console.log(data);
        context.switchToHttp().getResponse().status(data.status);
        return data.result;
      }),

    );
  }
}

