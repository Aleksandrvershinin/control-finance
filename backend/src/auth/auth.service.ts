import { Injectable } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { RequestLoginCodeDto } from './dto/request-login-code.dto'
import { ConfirmLoginCodeDto } from './dto/confirm-login-code.dto'
import { ConfirmChangePasswordDto } from './dto/confirm-change-password.dto'
import { EmailPasswordAuthService } from './providers/email-password-auth.service'
import { LoginEmailDto } from './dto/login-email.dto'
import { CodeAuthService } from './code/code-auth.service'
import { PasswordChangeService } from './password/password-change.service'
import { RefreshTokenService } from './token/refresh-token.service'
import { TelegramProviderService } from './providers/telegram-provider.service'
import { TelegramAuthDto } from './dto/telegram-auth.dto'

@Injectable()
export class AuthService {
    constructor(
        private readonly emailPasswordAuthService: EmailPasswordAuthService,
        private readonly codeAuthService: CodeAuthService,
        private readonly passwordChangeService: PasswordChangeService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly telegramProviderService: TelegramProviderService,
    ) {}

    register(dto: RegisterDto) {
        return this.emailPasswordAuthService.register(dto)
    }
    login(dto: LoginEmailDto) {
        return this.emailPasswordAuthService.login(dto)
    }
    refreshToken(refreshToken: string) {
        return this.refreshTokenService.refresh(refreshToken)
    }
    requestLoginCode(dto: RequestLoginCodeDto, ip: string) {
        return this.codeAuthService.requestLoginCode(dto, ip)
    }
    loginByCode(dto: ConfirmLoginCodeDto) {
        return this.codeAuthService.loginByCode(dto)
    }
    requestChangePasswordCode(userId: string) {
        return this.passwordChangeService.requestCode(userId)
    }
    changePassword(userId: string, dto: ConfirmChangePasswordDto) {
        return this.passwordChangeService.changePassword(userId, dto)
    }
    loginTelegram(dto: TelegramAuthDto) {
        return this.telegramProviderService.login(dto)
    }
}
