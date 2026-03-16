import { Expose, Type } from 'class-transformer'
import { TransactionType } from '@prisma/client'

export class ResponseTransactionDto {
    @Expose()
    id: string

    @Expose()
    type: TransactionType

    @Expose()
    accountId: string

    @Expose()
    categoryId?: string

    @Expose()
    date: Date

    @Expose()
    @Type(() => Number)
    amount: number

    @Expose()
    description?: string

    @Expose()
    toAccountId?: string

    @Expose()
    fundId?: string

    @Expose()
    toFundId?: string
}
