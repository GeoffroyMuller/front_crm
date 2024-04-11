import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "src/modules/auth/entities/user.entity";

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().auth as User;
  },
);
