import { PrismaService } from 'src/prisma/prisma.service'
import { AuthMethodsService } from '../providers/auth-methods.service'
import { CodeService } from './code.service'
import { MailService } from 'src/mail/mail.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { RequestLoginCodeDto } from '../dto/request-login-code.dto'
import { AuthProvider } from '@prisma/client'
import { ConfirmLoginCodeDto } from '../dto/confirm-login-code.dto'
import { LoginCodeThrottleService } from './login-code-throttle.service'
import { JwtTokenService } from '../token/jwt-token.service'
import { TelegramProviderService } from '../providers/telegram-provider.service'

@Injectable()
export class CodeAuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authMethodsService: AuthMethodsService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly codeService: CodeService,
        private readonly mailService: MailService,
        private readonly loginCodeThrottleService: LoginCodeThrottleService,
        private readonly telegramProviderService: TelegramProviderService,
    ) {}

    async requestLoginCode(dto: RequestLoginCodeDto, ip: string) {
        await this.loginCodeThrottleService.consume(ip)

        const authMethod = await this.authMethodsService.findByProvider(
            AuthProvider.EMAIL,
            dto.email,
        )

        if (!authMethod) {
            return {
                success: true,
                message: 'Код был отправлен',
            }
        }

        const { plainCode, codeHash } = await this.codeService.create()

        await this.mailService.sendLoginCode(dto.email, plainCode)

        await this.authMethodsService.update(authMethod.id, {
            loginCodeHash: codeHash,
            loginCodeExpire: new Date(Date.now() + 10 * 60 * 1000),
        })

        return {
            success: true,
            message: 'Код был отправлен',
        }
    }
    async loginByCode(dto: ConfirmLoginCodeDto) {
        const authMethod = await this.authMethodsService.findByProvider(
            AuthProvider.EMAIL,
            dto.email,
        )
        if (!authMethod) {
            throw new BadRequestException('Неверный код')
        }
        const user = authMethod.user
        if (!authMethod.loginCodeHash || !authMethod.loginCodeExpire) {
            throw new BadRequestException('Неверный код')
        }

        if (
            authMethod.loginBlockedUntil &&
            authMethod.loginBlockedUntil > new Date()
        ) {
            const diff = Math.ceil(
                (authMethod.loginBlockedUntil.getTime() - Date.now()) / 60000,
            )
            throw new BadRequestException(`Слишком много попыток`)
        }

        if (authMethod.loginCodeExpire < new Date()) {
            throw new BadRequestException('Время действия кода истекло')
        }

        const isValid = await this.codeService.verify(
            dto.code,
            authMethod.loginCodeHash,
        )

        if (!isValid) {
            // увеличиваем счетчик попыток
            let loginAttempts = (authMethod.loginAttempts || 0) + 1
            let loginBlockedUntil = authMethod.loginBlockedUntil

            if (loginAttempts >= 3) {
                loginBlockedUntil = new Date(Date.now() + 10 * 60 * 1000) // бан на 10 минут
                loginAttempts = 0 // сбрасываем счетчик после блокировки
            }

            await this.authMethodsService.update(authMethod.id, {
                loginAttempts,
                loginBlockedUntil,
            })

            throw new BadRequestException('Неверный код')
        }

        // если код правильный, сбрасываем счетчик
        await this.authMethodsService.update(authMethod.id, {
            loginCodeHash: null,
            loginCodeExpire: null,
            loginAttempts: 0,
            loginBlockedUntil: null,
        })
        if (dto.linkTelegram && dto.telegramInitData) {
            await this.telegramProviderService.linkTelegram(
                this.prisma,
                user.id,
                dto.telegramInitData,
            )
        }
        const tokens = this.jwtTokenService.generateUserTokens({
            userId: user.id,
            provider: authMethod.provider,
            providerId: authMethod.providerId,
        })
        return { tokens, user }
    }
}
