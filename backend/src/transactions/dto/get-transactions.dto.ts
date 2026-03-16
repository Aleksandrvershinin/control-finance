import { CategoryType, TransactionType } from '@prisma/client'
import { Transform, Type } from 'class-transformer'
import {
    IsOptional,
    IsString,
    IsInt,
    IsDateString,
    IsIn,
    IsArray,
} from 'class-validator'

export class GetTransactionsDto {
    @IsOptional() @Type(() => Number) @IsInt() limit?: number

    @IsOptional() @IsDateString() dateFrom?: string

    @IsOptional() @IsDateString() dateTo?: string

    @IsOptional() @IsString() cursor?: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (!value) return undefined
        if (Array.isArray(value)) return value
        return [value]
    })
    accountIds?: string[]

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (!value) return undefined
        if (Array.isArray(value)) return value
        return [value]
    })
    categoryIds?: string[]

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (!value) return undefined
        if (Array.isArray(value)) return value
        return [value]
    })
    fundIds?: string[]

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (!value) return undefined
        const arr = Array.isArray(value) ? value : [value]
        return arr.map((v) => (typeof v === 'string' ? v.toUpperCase() : v))
    })
    transactionTypes?: TransactionType[]

    @IsOptional()
    @IsIn(['date', 'amount', 'description'])
    sortField?: string

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc'
}
