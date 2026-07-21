import { Form, FormRootMessage, LoadingButton, Stack } from '@/shared/ui'
import { CreateTransactionConfig } from '../model/useCreateTransactionDialogStore'
import { useTransferForm } from '../model/useTransferForm'
import { TransactionForm } from '@/entities/transaction'
import { TransactionAccountField } from './TransactionAccountField'
import {
    TransactionAmountField,
    TransactionCommentField,
    TransactionDateField,
} from '../../baseTransactionForm'

interface Props {
    config: CreateTransactionConfig
}

export const CreateTransferForm = ({ config }: Props) => {
    const form = useTransferForm(config)
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
                    <TransactionAccountField
                        lable="Счет зачисления"
                        name="toAccountId"
                    />
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
