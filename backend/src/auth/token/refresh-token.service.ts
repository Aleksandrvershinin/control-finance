import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtTokenService } from './jwt-token.service'

@Injectable()
export class RefreshTokenService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtTokenService: JwtTokenService,
    ) {}

    async refresh(refreshToken: string) {
        try {
            const payload =
                this.jwtTokenService.verifyRefreshToken(refreshToken)

            const authMethod = await this.prisma.authMethod.findUnique({
                where: {
                    provider_providerId: {
                        provider: payload.provider,
                        providerId: payload.providerId,
                    },
                },
            })

            if (!authMethod || authMethod.userId !== payload.sub) {
                throw new UnauthorizedException()
            }

            return this.jwtTokenService.generateUserTokens({
                userId: authMethod.userId,
                provider: authMethod.provider,
                providerId: authMethod.providerId,
            })
        } catch {
            throw new UnauthorizedException('Invalid refresh token')
        }
    }
}
