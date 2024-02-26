import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Origin = createParamDecorator(
  (_data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers.origin;
  },
);
