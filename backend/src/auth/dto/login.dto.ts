import { IsEmail, IsString, MaxLength, Min, MinLength } from 'class-validator'

export class LoginUserDto {
    @IsString()
    recaptchaToken: string

    @IsString()
    @MinLength(4)
    password: string

    @IsEmail()
    email: string
}
