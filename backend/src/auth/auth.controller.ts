import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginUserDto } from './dto/login.dto'
import { plainToClass } from 'class-transformer'
import { RecaptchaGuard } from 'src/recaptcha/recaptcha.guard'
import { Recaptcha } from 'src/recaptcha/recaptcha.decorator'
import { RequestLoginCodeDto } from './dto/request-login-code.dto'
import { ConfirmLoginCodeDto } from './dto/confirm-login-code.dto'
import { ResponseUserDto } from 'src/users/dto/response-user.dto'

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prod',
    sameSite: 'strict' as const,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

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
        @Body() dto: LoginUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { tokens, user } = await this.authService.login({
            email: dto.email,
            password: dto.password,
        })
        res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions)

        return {
            accessToken: tokens.accessToken,
            user: plainToClass(ResponseUserDto, user, {
                excludeExtraneousValues: true,
            }),
        }
    }
    @UseGuards(RecaptchaGuard)
    @Post('login/code/request')
    @Recaptcha('loginCodeRequest')
    requestCode(@Body() dto: RequestLoginCodeDto, @Req() req: Request) {
        const ip = req.ip
        if (!ip) {
            throw new BadRequestException('Не удалось определить IP')
        }
        return this.authService.requestLoginCode(dto, ip)
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
    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = req.cookies.refreshToken
        if (!token) {
            throw new BadRequestException('Refresh token is missing')
        }

        const tokens = await this.authService.refresh(token)

        res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions)

        return {
            accessToken: tokens.accessToken,
        }
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken', refreshCookieOptions)

        return { success: true }
    }
}
