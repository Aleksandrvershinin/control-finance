import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator'

export class CreateAccountDto {
    @IsString()
    @MinLength(2)
    name: string

    @IsInt()
    initialBalance: number

    @IsOptional()
    @IsInt()
    order?: number

    @IsOptional()
    @IsBoolean()
    isHidden?: boolean
}
