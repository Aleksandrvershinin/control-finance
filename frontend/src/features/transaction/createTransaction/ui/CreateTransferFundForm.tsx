import { Form, FormRootMessage, LoadingButton, Stack } from '@/shared/ui'
import { TransactionForm } from '@/entities/transaction'
import {
    TransactionAmountField,
    TransactionCommentField,
    TransactionDateField,
} from '../../baseTransactionForm'
import { useTransferFundForm } from '../model/useTransferFundForm'
import { TransactionFundField } from './TransactionFundField'
import { TransactionToFundField } from './TransactionToFundField'

export const CreateTransferFundForm = () => {
    const form = useTransferFundForm()
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
                    <TransactionFundField />
                    <TransactionToFundField />
                    <TransactionAmountField />
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
