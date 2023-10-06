import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) : number | null =>{
        const requst = ctx.switchToHttp().getRequest();
        return requst.user?.id ? Number(requst.user.id) : null;
    },
)