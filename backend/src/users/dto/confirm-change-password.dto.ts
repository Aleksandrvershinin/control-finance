import { IsString, Length, MinLength } from 'class-validator'

const MIN_PASSWORD_LENGTH = 4

export class ConfirmChangePasswordDto {
    @Length(6, 6)
    code: string

    @IsString()
    @MinLength(MIN_PASSWORD_LENGTH, {
        message: `Пароль должен содержать минимум ${MIN_PASSWORD_LENGTH} символов`,
    })
    newPassword: string

    @IsString()
    recaptchaToken: string
}
