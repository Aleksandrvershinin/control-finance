import { PrismaService } from 'src/prisma/prisma.service'
import { AuthMethodsService } from './auth-methods.service'
import { JwtTokenService } from '../token/jwt-token.service'
import { TelegramAuthService } from '../telegram/telegram-auth.service'
import { AuthProvider, Prisma } from '@prisma/client'
import { TelegramAuthDto } from '../dto/telegram-auth.dto'
import { ConflictException, Injectable } from '@nestjs/common'

type DbClient = PrismaService | Prisma.TransactionClient

@Injectable()
export class TelegramProviderService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authMethodsService: AuthMethodsService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly telegramAuthService: TelegramAuthService,
    ) {}

    async login(dto: TelegramAuthDto) {
        const telegramUser = this.telegramAuthService.verify(dto.initData)

        let authMethod = await this.authMethodsService.findByProvider(
            AuthProvider.TELEGRAM,
            telegramUser.id.toString(),
        )

        if (!authMethod) {
            authMethod = await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.create({ data: {} })

                return tx.authMethod.create({
                    data: {
                        provider: AuthProvider.TELEGRAM,
                        providerId: telegramUser.id.toString(),
                        userId: user.id,
                    },
                    include: {
                        user: true,
                    },
                })
            })
        }

        return {
            user: authMethod.user,
            tokens: this.jwtTokenService.generateUserTokens({
                userId: authMethod.user.id,
                provider: authMethod.provider,
                providerId: authMethod.providerId,
            }),
        }
    }

    async linkTelegram(db: DbClient, userId: string, initData: string) {
        const telegramUser = this.telegramAuthService.verify(initData)

        const providerId = telegramUser.id.toString()

        const existing = await db.authMethod.findUnique({
            where: {
                provider_providerId: {
                    provider: AuthProvider.TELEGRAM,
                    providerId,
                },
            },
        })

        if (existing?.userId === userId) {
            return
        }

        if (existing) {
            throw new ConflictException(
                'Этот Telegram уже привязан к другому аккаунту',
            )
        }

        try {
            await db.authMethod.create({
                data: {
                    provider: AuthProvider.TELEGRAM,
                    providerId,
                    userId,
                },
            })
        } catch (e) {
            if (
                e instanceof Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2002'
            ) {
                throw new ConflictException(
                    'Этот Telegram уже привязан к другому аккаунту',
                )
            }

            throw e
        }
    }
}
