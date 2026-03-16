import { CategoryType } from '@prisma/client'
import { Expose } from 'class-transformer'

export class ResponseCategoryDto {
    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    type: CategoryType
}
