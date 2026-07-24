import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthMethodsService } from './auth-methods.service'
import { PasswordService } from '../password/password.service'
import { LoginEmailDto } from '../dto/login-email.dto'
import { AuthProvider } from '@prisma/client'
import { RegisterDto } from '../dto/register.dto'
import { JwtTokenService } from '../token/jwt-token.service'
import { TelegramProviderService } from './telegram-provider.service'

@Injectable()
export class EmailPasswordAuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authMethodsService: AuthMethodsService,
        private readonly passwordService: PasswordService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly telegramProviderService: TelegramProviderService,
    ) {}
    async login(dto: LoginEmailDto) {
        const authMethod = await this.authMethodsService.findByProvider(
            AuthProvider.EMAIL,
            dto.email,
        )

        if (!authMethod || !authMethod.passwordHash) {
            throw new BadRequestException('Email не найден')
        }

        const isValid = await this.passwordService.verify(
            dto.password,
            authMethod.passwordHash,
        )

        if (!isValid) {
            throw new BadRequestException('Неверный пароль или email')
        }
        if (dto.linkTelegram && dto.telegramInitData) {
            await this.telegramProviderService.linkTelegram(
                this.prisma,
                authMethod.user.id,
                dto.telegramInitData,
            )
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
    async register(dto: RegisterDto) {
        const { email, password, currencyId } = dto

        const existingAuthMethod = await this.authMethodsService.findByProvider(
            AuthProvider.EMAIL,
            email,
        )

        if (existingAuthMethod) {
            throw new BadRequestException(
                'Пользователь с этим email уже зарегистрирован',
            )
        }

        const currency = await this.prisma.currency.findUnique({
            where: {
                id: currencyId,
            },
        })

        if (!currency) {
            throw new BadRequestException('Валюта не найдена')
        }

        const passwordHash = await this.passwordService.hash(password)

        const { user, authMethod } = await this.prisma.$transaction(
            async (tx) => {
                const user = await tx.user.create({
                    data: {
                        currency: {
                            connect: {
                                id: currencyId,
                            },
                        },
                    },
                    include: {
                        currency: true,
                    },
                })

                const authMethod = await tx.authMethod.create({
                    data: {
                        provider: AuthProvider.EMAIL,
                        providerId: email,
                        passwordHash,
                        userId: user.id,
                    },
                })
                if (dto.linkTelegram && dto.telegramInitData) {
                    await this.telegramProviderService.linkTelegram(
                        tx,
                        user.id,
                        dto.telegramInitData,
                    )
                }
                return {
                    user,
                    authMethod,
                }
            },
        )

        const tokens = this.jwtTokenService.generateUserTokens({
            userId: user.id,
            provider: authMethod.provider,
            providerId: authMethod.providerId,
        })

        return {
            tokens,
            user,
        }
    }
}
