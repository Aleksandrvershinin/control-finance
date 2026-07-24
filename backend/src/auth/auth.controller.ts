import {
    BadRequestException,
    Body,
    Controller,
    Patch,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { plainToClass } from 'class-transformer'

import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginEmailDto } from './dto/login-email.dto'
import { RequestLoginCodeDto } from './dto/request-login-code.dto'
import { ConfirmLoginCodeDto } from './dto/confirm-login-code.dto'

import { ResponseUserDto } from 'src/users/dto/response-user.dto'

import { Auth } from 'src/common/decorators/auth.decorator'

import { Recaptcha } from 'src/recaptcha/recaptcha.decorator'
import { RecaptchaGuard } from 'src/recaptcha/recaptcha.guard'

import { JwtAuthGuard } from './jwt-auth.guard'
import { ConfirmChangePasswordDto } from './dto/confirm-change-password.dto'
import { RequestChangePasswordCodeDto } from './dto/request-change-password-code.dto'
import { TelegramAuthDto } from './dto/telegram-auth.dto'

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prod',
    sameSite: 'strict' as const,
    maxAge: 30 * 24 * 60 * 60 * 1000,
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(RecaptchaGuard)
    @Recaptcha('register')
    @Post('register')
    async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { tokens, user } = await this.authService.register(dto)

        res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions)

        return {
            accessToken: tokens.accessToken,
            user: plainToClass(ResponseUserDto, user, {
                excludeExtraneousValues: true,
            }),
        }
    }

    @UseGuards(RecaptchaGuard)
    @Recaptcha('login')
    @Post('login')
    async login(
        @Body() dto: LoginEmailDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { tokens, user } = await this.authService.login(dto)

        res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions)

        return {
            accessToken: tokens.accessToken,
            user: plainToClass(ResponseUserDto, user, {
                excludeExtraneousValues: true,
            }),
        }
    }

    @UseGuards(RecaptchaGuard)
    @Recaptcha('loginCodeRequest')
    @Post('login/code/request')
    requestCode(@Body() dto: RequestLoginCodeDto, @Req() req: Request) {
        if (!req.ip) {
            throw new BadRequestException('Не удалось определить IP')
        }

        return this.authService.requestLoginCode(dto, req.ip)
    }

    @UseGuards(RecaptchaGuard)
    @Recaptcha('loginCodeConfirm')
    @Post('login/code/confirm')
    async loginByCode(
        @Body() dto: ConfirmLoginCodeDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { tokens, user } = await this.authService.loginByCode(dto)

        res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions)

        return {
            accessToken: tokens.accessToken,
            user: plainToClass(ResponseUserDto, user, {
                excludeExtraneousValues: true,
            }),
        }
    }

    @UseGuards(JwtAuthGuard, RecaptchaGuard)
    @Recaptcha('changePasswordCodeRequest')
    @Post('password/code/request')
    requestChangePasswordCode(
        @Auth('userId') userId: string,
        @Body() _dto: RequestChangePasswordCodeDto,
    ) {
        return this.authService.requestChangePasswordCode(userId)
    }

    @UseGuards(JwtAuthGuard, RecaptchaGuard)
    @Recaptcha('changePasswordConfirm')
    @Patch('password')
    changePassword(
        @Auth('userId') userId: string,
        @Body() dto: ConfirmChangePasswordDto,
    ) {
        return this.authService.changePassword(userId, dto)
    }

    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = req.cookies.refreshToken

        if (!token) {
            throw new BadRequestException('Refresh token is missing')
        }

        const tokens = await this.authService.refreshToken(token)

        res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions)

        return {
            accessToken: tokens.accessToken,
        }
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken', refreshCookieOptions)

        return {
            success: true,
        }
    }
    @Post('login/telegram')
    async telegram(
        @Body() dto: TelegramAuthDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { user, tokens } = await this.authService.loginTelegram(dto)

        res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions)

        return {
            accessToken: tokens.accessToken,
            user: plainToClass(ResponseUserDto, user, {
                excludeExtraneousValues: true,
            }),
        }
    }
}
