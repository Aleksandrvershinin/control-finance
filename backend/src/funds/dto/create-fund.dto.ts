import { IsHexColor, IsInt, IsOptional, IsString } from 'class-validator'

export class CreateFundDto {
    @IsString()
    name: string

    @IsOptional()
    @IsHexColor()
    colorBg?: string

    @IsOptional()
    @IsInt()
    order?: number
}
