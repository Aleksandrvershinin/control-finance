import { IsString } from 'class-validator'

export class RequestChangePasswordCodeDto {
    @IsString()
    recaptchaToken: string
}
