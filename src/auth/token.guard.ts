import {
  UnauthorizedException,
  Logger,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Public, PublicKey } from './public.decorator';
import { UserService } from '@data/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class TokenGuard implements CanActivate {
  private readonly log = new Logger(TokenGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PublicKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const jwtSecret = this.config.get<string>('host.jwtsecret');
    const request = context.switchToHttp().getRequest();
    const [authType, token] = request.headers.authorization?.split(' ') ?? [];
    const authToken = authType === 'Bearer' ? token : undefined;

    if (authToken) {
      await this.userService.updateLastAccess(token);
      const authUser = await this.userService.getUserByToken(authToken);
      if (authUser) {
        request['user'] = authUser.profile;
        return true;
      }
      this.log.error('Invalid or unknown token', authToken);
      throw new UnauthorizedException();
    }

    this.log.warn('No authorization supplied');
    throw new UnauthorizedException();
    return false;
  }
}
