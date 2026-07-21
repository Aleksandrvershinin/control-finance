import { TransactionForm } from '@/entities/transaction'
import { CreateTransactionConfig } from '../model/useCreateTransactionDialogStore'
import { useIncomeExpenseForm } from '../model/useIncomeExpenseForm'
import { Form, FormRootMessage, LoadingButton, Stack } from '@/shared/ui'
import { TransactionAccountField } from './TransactionAccountField'
import { TransactionFundField } from './TransactionFundField'
import {
    TransactionAmountField,
    TransactionCategoryField,
    TransactionCommentField,
    TransactionDateField,
} from '../../baseTransactionForm'

interface Props {
    config: CreateTransactionConfig
}

export const CreateIncomeExpenseForm = ({ config }: Props) => {
    const form = useIncomeExpenseForm(config)
    const { onSubmit, ...formProps } = form

    const {
        formState: { isSubmitting },
    } = formProps
    return (
        <Form {...formProps}>
            <TransactionForm
                onSubmit={formProps.handleSubmit(onSubmit)}
                {...formProps}
            >
                <FormRootMessage className="text-center" />

                <Stack direction={'column'}>
                    <TransactionAccountField lable="Счет" name="accountId" />
                    <TransactionFundField />
                    <TransactionAmountField />
                    <TransactionCategoryField
                        type={config.type === 'EXPENSE' ? 'EXPENSE' : 'INCOME'}
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
                    Создать
                </LoadingButton>
            </TransactionForm>
        </Form>
    )
}
