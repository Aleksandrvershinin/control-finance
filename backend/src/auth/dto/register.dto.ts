import {
    IsBoolean,
    IsEmail,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator'

export class RegisterDto {
    @IsEmail()
    email!: string

    @IsString()
    @MinLength(4)
    password!: string

    @IsString()
    currencyId!: string

    @IsString()
    recaptchaToken!: string

    @IsBoolean()
    @IsOptional()
    linkTelegram?: boolean

    @IsString()
    @IsOptional()
    telegramInitData?: string
}
