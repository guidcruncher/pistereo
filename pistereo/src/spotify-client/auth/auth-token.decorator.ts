import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const [authType, token] = request.headers.authorization?.split(' ') ?? [];
    const authToken = authType === 'Bearer' ? token : '';
    return authToken;
  },
);
