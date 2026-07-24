// dto/confirm-login-code.dto.ts
import {
    IsBoolean,
    IsEmail,
    IsOptional,
    IsString,
    Length,
} from 'class-validator'

export class ConfirmLoginCodeDto {
    @IsEmail()
    email!: string

    @Length(6, 6)
    code!: string

    @IsString()
    recaptchaToken!: string

    @IsString()
    @IsOptional()
    telegramInitData?: string

    @IsBoolean()
    @IsOptional()
    linkTelegram?: boolean
}
