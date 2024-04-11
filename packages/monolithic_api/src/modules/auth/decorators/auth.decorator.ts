import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().auth;
  },
);
