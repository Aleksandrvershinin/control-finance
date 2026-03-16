// dto/request-login-code.dto.ts
import { IsEmail, IsString } from 'class-validator'

export class RequestLoginCodeDto {
    @IsEmail()
    email: string

    @IsString()
    recaptchaToken: string
}
