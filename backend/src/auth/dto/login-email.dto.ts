import {
    IsBoolean,
    IsEmail,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator'

export class LoginEmailDto {
    @IsString()
    recaptchaToken!: string

    @IsString()
    @MinLength(4)
    password!: string

    @IsEmail()
    email!: string

    @IsString()
    @IsOptional()
    telegramInitData?: string

    @IsBoolean()
    @IsOptional()
    linkTelegram?: boolean
}
