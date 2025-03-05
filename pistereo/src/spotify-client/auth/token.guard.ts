import {
  Logger,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Public } from './public.decorator';

@Injectable()
export class TokenGuard implements CanActivate {
  private readonly log = new Logger(TokenGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.log.debug('Skipping token check on public route');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const [authType, token] = request.headers.authorization?.split(' ') ?? [];
    const authToken = authType === 'Bearer' ? token : undefined;

    if (authToken) {
      this.log.debug('Token found = ' + authType + ' ' + authToken);
      return true;
    }

    this.log.warn('No token found on private request');
    return false;
  }
}
