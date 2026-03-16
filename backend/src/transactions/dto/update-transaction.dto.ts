import { IsISO8601, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class UpdateTransactionDto {
    @IsOptional()
    @IsNumber()
    amount?: number

    @IsOptional()
    @IsISO8601()
    date?: string

    @IsOptional()
    @IsString()
    description?: string
}
