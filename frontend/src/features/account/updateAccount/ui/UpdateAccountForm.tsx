import { Form, FormRootMessage, LoadingButton, Stack } from '@/shared/ui'
import { Account } from '@/entities/account'
import { useUpdateAccountForm } from '../model/useUpdateAccountForm'
import { AccountNameField, AccountOrderField } from '../../baseAccountForm'

interface UpdateAccountFormProps {
    account: Account
}

export function UpdateAccountForm({ account }: UpdateAccountFormProps) {
    const form = useUpdateAccountForm(account)
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
                    <AccountNameField />
                    <AccountOrderField />
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
