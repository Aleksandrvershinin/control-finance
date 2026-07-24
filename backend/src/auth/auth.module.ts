import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { MailModule } from 'src/mail/mail.module'
import { CacheModule } from 'src/cache/cache.module'
import { AuthMethodsService } from './providers/auth-methods.service'
import { CodeService } from './code/code.service'
import { PasswordService } from './password/password.service'
import { EmailPasswordAuthService } from './providers/email-password-auth.service'
import { CodeAuthService } from './code/code-auth.service'
import { LoginCodeThrottleService } from './code/login-code-throttle.service'
import { PasswordChangeService } from './password/password-change.service'
import { RefreshTokenService } from './token/refresh-token.service'
import { JwtTokenService } from './token/jwt-token.service'
import { TelegramAuthService } from './telegram/telegram-auth.service'
import { TelegramProviderService } from './providers/telegram-provider.service'

@Module({
    imports: [
        CacheModule,
        MailModule,
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'super-secret-key',
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        AuthMethodsService,
        JwtTokenService,
        CodeService,
        PasswordService,
        EmailPasswordAuthService,
        CodeAuthService,
        LoginCodeThrottleService,
        PasswordChangeService,
        RefreshTokenService,
        TelegramAuthService,
        TelegramProviderService,
    ],
})
export class AuthModule {}
