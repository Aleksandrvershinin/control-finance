import z from 'zod'
import { transactionFields } from '../../baseTransactionForm'
import { TRANSACTION_TYPES, TRANSFER_TYPES } from '@/entities/transaction'

export const createIncomeExpenseFormSchema = z.object({
    type: z.enum([TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE]),
    amount: transactionFields.amount,
    date: transactionFields.date,
    description: transactionFields.description,
    accountId: transactionFields.accountId,
    categoryId: transactionFields.categoryId,
    fundId: transactionFields.fundId,
})

export const createTransferFormSchema = z
    .object({
        type: z.enum([TRANSACTION_TYPES.TRANSFER]),
        amount: transactionFields.amount,
        date: transactionFields.date,
        description: transactionFields.description,
        accountId: transactionFields.accountId,
        toAccountId: transactionFields.toAccountId,
    })
    .superRefine((data, ctx) => {
        if (
            data.accountId &&
            data.toAccountId &&
            data.accountId === data.toAccountId
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Нельзя переводить в тот же счет',
                path: ['toAccountId'],
            })
        }
    })

export const createTransferFundFormSchema = z
    .object({
        type: z.enum([TRANSACTION_TYPES.TRANSFER]),
        transferType: z.enum([TRANSFER_TYPES.FUNDS]),
        amount: transactionFields.amount,
        date: transactionFields.date,
        description: transactionFields.description,
        fundId: transactionFields.fundId,
        toFundId: transactionFields.toFundId,
    })
    .superRefine((data, ctx) => {
        if (data.fundId === data.toFundId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Нельзя переводить в тот же фонд',
                path: ['toFundId'],
            })
        }
    })
export type CreateIncomeExpenseFormValues = z.infer<
    typeof createIncomeExpenseFormSchema
>
export type CreateTransferFormValues = z.infer<typeof createTransferFormSchema>
export type CreateTransferFundFormValues = z.infer<
    typeof createTransferFundFormSchema
>
