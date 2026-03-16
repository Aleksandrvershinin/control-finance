import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UsersService } from 'src/users/users.service'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'
import { RequestLoginCodeDto } from './dto/request-login-code.dto'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { ConfirmLoginCodeDto } from './dto/confirm-login-code.dto'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private usersService: UsersService,
        private readonly mailService: MailService,
    ) {}

    generateTokens(payload: any) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        }
    }
    async register(dto: RegisterDto) {
        const user = await this.usersService.create(dto)
        const tokens = this.generateTokens({
            sub: user.id,
            email: user.email,
        })
        return { tokens, user }
    }
    async login({ email, password }: { email: string; password: string }) {
        const user = await this.usersService.findByEmail(email)

        if (!user) {
            throw new BadRequestException('Email не найден')
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            throw new BadRequestException('Неверный пароль или email')
        }

        const tokens = this.generateTokens({
            sub: user.id,
            email: user.email,
        })
        return { tokens, user }
    }
    async refresh(refreshToken: string) {
        try {
            const payload = this.jwt.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            })

            const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.sub,
                },
            })

            if (!user) {
                throw new UnauthorizedException('Invalid refresh token')
            }

            return this.generateTokens({
                sub: user.id,
                email: user.email,
            })
        } catch {
            throw new UnauthorizedException('Invalid refresh token')
        }
    }
    async requestLoginCode(dto: RequestLoginCodeDto, ip: string) {
        const THROTTLE_TTL = 2 * 60 * 1000
        const thresholdDate = new Date(Date.now() - THROTTLE_TTL)

        await this.prisma.codeThrottle.deleteMany({
            where: {
                createdAt: {
                    lt: thresholdDate,
                },
            },
        })

        const activeThrottle = await this.prisma.codeThrottle.findFirst({
            where: {
                ip,
                createdAt: {
                    gte: thresholdDate,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        if (activeThrottle) {
            throw new BadRequestException(
                'Повторная отправка возможна через 2 минуты',
            )
        }

        await this.prisma.codeThrottle.create({
            data: {
                ip,
            },
        })

        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        })
        if (!user) {
            return { success: true, message: 'Код был отправлен' }
        }

        const code = this.generateCode()
        const codeHash = await bcrypt.hash(code, 10)

        await this.mailService.sendLoginCode(user.email, code)
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                loginCodeHash: codeHash,
                loginCodeExpire: new Date(Date.now() + 10 * 60 * 1000), // 10 минут
            },
        })

        return { success: true, message: 'Код был отправлен' }
    }
    async loginByCode(dto: ConfirmLoginCodeDto) {
        const user = await this.usersService.findByEmail(dto.email)
        if (!user) {
            throw new BadRequestException('Неверный код')
        }

        if (!user.loginCodeHash || !user.loginCodeExpire) {
            throw new BadRequestException('Неверный код')
        }

        if (user.loginBlockedUntil && user.loginBlockedUntil > new Date()) {
            const diff = Math.ceil(
                (user.loginBlockedUntil.getTime() - Date.now()) / 60000,
            )
            throw new BadRequestException(`Слишком много попыток`)
        }

        if (user.loginCodeExpire < new Date()) {
            throw new BadRequestException('Время действия кода истекло')
        }

        const isValid = await bcrypt.compare(dto.code, user.loginCodeHash)

        if (!isValid) {
            // увеличиваем счетчик попыток
            let loginAttempts = (user.loginAttempts || 0) + 1
            let loginBlockedUntil = user.loginBlockedUntil

            if (loginAttempts >= 3) {
                loginBlockedUntil = new Date(Date.now() + 10 * 60 * 1000) // бан на 10 минут
                loginAttempts = 0 // сбрасываем счетчик после блокировки
            }

            await this.prisma.user.update({
                where: { id: user.id },
                data: { loginAttempts, loginBlockedUntil },
            })

            throw new BadRequestException('Неверный код')
        }

        // если код правильный, сбрасываем счетчик
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                loginCodeHash: null,
                loginCodeExpire: null,
                loginAttempts: 0,
                loginBlockedUntil: null,
            },
        })

        const tokens = this.generateTokens({
            sub: user.id,
            email: user.email,
        })
        return { tokens, user }
    }

    private generateCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }
    private generateAccessToken(payload: any) {
        return this.jwt.sign(payload, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: this.config.get('ACCESS_EXPIRES'),
        })
    }

    private generateRefreshToken(payload: any) {
        return this.jwt.sign(payload, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: this.config.get('REFRESH_EXPIRES'),
        })
    }
}
