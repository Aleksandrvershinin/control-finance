import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { AuthProvider } from '@prisma/client'

import { UsersService } from 'src/users/users.service'
import { JwtPayload } from '../types/jwt-payload.type'

export interface AuthPayload {
    userId: string
    provider: AuthProvider
    providerId: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:
                config.get<string>('JWT_ACCESS_SECRET') ?? 'JWT_ACCESS_SECRET',
        })
    }

    async validate(payload: JwtPayload): Promise<AuthPayload> {
        await this.usersService.findById(payload.sub)

        return {
            userId: payload.sub,
            provider: payload.provider,
            providerId: payload.providerId,
        }
    }
}
