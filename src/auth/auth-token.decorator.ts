import { Logger, SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfile } from '@data/dto/userprofile.dto';

export const AuthToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const log = new Logger(AuthToken.name);
    const request = ctx.switchToHttp().getRequest();
    const [authType, token] = request.headers.authorization?.split(' ') ?? [];
    let authToken = authType === 'Bearer' ? token : '';
    return authToken;
  },
);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserProfile => {
    const log = new Logger(User.name);
    const request = ctx.switchToHttp().getRequest();
    const user = request['user'];
    if (user) {
      return user as UserProfile;
    }
    return {} as UserProfile;
  },
);
