// dto/confirm-login-code.dto.ts
import { IsEmail, IsString, Length } from 'class-validator'

export class ConfirmLoginCodeDto {
    @IsEmail()
    email: string

    @Length(6, 6)
    code: string

    @IsString()
    recaptchaToken: string
}
