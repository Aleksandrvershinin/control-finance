import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AuthProvider } from '@prisma/client'
import { JwtPayload } from '../types/jwt-payload.type'

@Injectable()
export class JwtTokenService {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) {}

    verifyRefreshToken(token: string): JwtPayload {
        return this.jwt.verify<JwtPayload>(token, {
            secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        })
    }

    generateUserTokens(params: {
        userId: string
        provider: AuthProvider
        providerId: string
    }) {
        return this.generateTokens(this.createPayload(params))
    }
    private createPayload(params: {
        userId: string
        provider: AuthProvider
        providerId: string
    }): JwtPayload {
        return {
            sub: params.userId,
            provider: params.provider,
            providerId: params.providerId,
        }
    }
    private generateTokens(payload: JwtPayload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        }
    }

    private generateAccessToken(payload: JwtPayload) {
        return this.jwt.sign(payload, {
            secret: this.config.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.config.get<string>('ACCESS_EXPIRES'),
        })
    }

    private generateRefreshToken(payload: JwtPayload) {
        return this.jwt.sign(payload, {
            secret: this.config.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.config.get<string>('REFRESH_EXPIRES'),
        })
    }
}
