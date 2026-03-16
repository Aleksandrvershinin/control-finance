import { Form, FormRootMessage, LoadingButton, Stack } from '@/shared/ui'
import { useCreateTransactionForm } from '../model/useCreateTransactionForm'
import { CreateTransactionConfig } from '../model/useCreateTransactionDialogStore'
import { TransactionAccountField } from './TransactionAccountField'
import {
    TransactionAmountField,
    TransactionCategoryField,
    TransactionCommentField,
    TransactionDateField,
} from '../../baseTransactionForm'
import { TransactionFundField } from './TransactionFundField'
import { TransactionToFundField } from './TransactionToFundField'

interface TransactionFormProps {
    config: CreateTransactionConfig
}

export function CreateTransactionForm({ config }: TransactionFormProps) {
    const form = useCreateTransactionForm(config)
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
                    <TransactionAccountField lable="Счет" name="accountId" />
                    <TransactionFundField />
                    {config.type === 'TRANSFER' && (
                        <>
                            <TransactionAccountField
                                lable="Счет зачисления"
                                name="toAccountId"
                            />
                            <TransactionToFundField />
                        </>
                    )}
                    <TransactionAmountField />
                    {config.type !== 'TRANSFER' && (
                        <TransactionCategoryField type={config.type} />
                    )}
                    <TransactionDateField />
                    <TransactionCommentField />
                </Stack>

                <LoadingButton
                    loading={isSubmitting}
                    className="w-full"
                    type="submit"
                    disabled={isSubmitting}
                >
                    Создать
                </LoadingButton>
            </form>
        </Form>
    )
}
