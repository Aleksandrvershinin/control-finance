import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class ReorderAccountItemDto {
    @IsUUID()
    id: string

    @IsInt()
    @Min(0)
    order: number
}

export class ReorderAccountsDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ReorderAccountItemDto)
    items: ReorderAccountItemDto[]
}
