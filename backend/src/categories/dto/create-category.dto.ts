import { CategoryType } from '@prisma/client'
import { IsEnum, IsHexColor, IsString } from 'class-validator'

export class CreateCategoryDto {
    @IsString()
    name: string

    @IsEnum(CategoryType)
    type: CategoryType
}
