import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { MailModule } from 'src/mail/mail.module'
import { CacheModule } from 'src/cache/cache.module'

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
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
