import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { AuthPayload } from '../interfaces/auth-payload.interface'

export const Auth = createParamDecorator(
    <T extends keyof AuthPayload>(
        data: T,
        ctx: ExecutionContext,
    ): AuthPayload[T] | AuthPayload => {
        const request = ctx
            .switchToHttp()
            .getRequest<Request & { user: AuthPayload }>()

        return data ? request.user?.[data] : request.user
    },
)
