import { TransactionType } from '@prisma/client'
import {
    IsEnum,
    IsIn,
    IsISO8601,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateIf,
} from 'class-validator'

enum TransferType {
    FUNDS = 'FUNDS',
}
export class CreateTransactionDto {
    @IsOptional()
    @IsEnum(TransferType)
    transferType?: TransferType

    @ValidateIf((o) => o.transferType !== 'FUNDS')
    @IsNotEmpty()
    @IsString()
    accountId: string

    @ValidateIf(
        (o) =>
            o.type === TransactionType.EXPENSE ||
            o.type === TransactionType.INCOME,
    )
    @IsNotEmpty()
    @IsString()
    categoryId: string

    @IsNumber()
    @Min(0.0000000001)
    amount: number

    @IsISO8601()
    date: string

    @IsIn(['INCOME', 'EXPENSE', 'TRANSFER'], {
        message: 'Тип должен быть, доход, расход или перевод',
    })
    type: (typeof TransactionType)[keyof typeof TransactionType]

    @ValidateIf(
        (o) =>
            o.type === TransactionType.TRANSFER && o.transferType !== 'FUNDS',
    )
    @IsNotEmpty()
    @IsString()
    toAccountId: string

    @IsOptional()
    @IsString()
    fundId?: string

    @ValidateIf((o) => o.type === TransactionType.TRANSFER)
    @IsOptional()
    @IsString()
    toFundId?: string

    @IsOptional()
    @IsString()
    description?: string
}
