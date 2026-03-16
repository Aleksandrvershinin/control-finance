import { Form, FormRootMessage, LoadingButton, Stack } from '@/shared/ui'
import { Transaction } from '@/entities/transaction'
import { useUpdateTransactionForm } from '../model/useUpdateTransactionForm'
import {
    TransactionAmountField,
    TransactionCommentField,
    TransactionDateField,
} from '../../baseTransactionForm'

interface TransactionFormProps {
    transaction: Transaction
}

export function UpdateTransactionForm({ transaction }: TransactionFormProps) {
    const form = useUpdateTransactionForm(transaction)
    const { onSubmit, ...formProps } = form

    const {
        formState: { isSubmitting },
    } = formProps
    return (
        <Form {...formProps}>
            <form
                onSubmit={formProps.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
            >
                <FormRootMessage className="text-center" />

                <Stack direction={'column'}>
                    <TransactionAmountField
                        allowNegative={transaction.type === 'INITIAL'}
                    />

                    <TransactionDateField />
                    <TransactionCommentField />
                </Stack>

                <LoadingButton
                    loading={isSubmitting}
                    className="w-full"
                    type="submit"
                    disabled={isSubmitting}
                >
                    Обновить
                </LoadingButton>
            </form>
        </Form>
    )
}
