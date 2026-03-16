import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class ReorderFundItemDto {
    @IsUUID()
    id: string

    @IsInt()
    @Min(0)
    order: number
}

export class ReorderFundsDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ReorderFundItemDto)
    items: ReorderFundItemDto[]
}
