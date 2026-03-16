import { Form, FormRootMessage, LoadingButton, Stack } from '@/shared/ui'
import { useCreateAccountForm } from '../model/useCreateAccountForm'
import {
    AccountInitialBalanceField,
    AccountNameField,
    AccountOrderField,
} from '../../baseAccountForm'

export function CreateAccountForm() {
    const form = useCreateAccountForm()
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
                    <AccountInitialBalanceField />
                    <AccountOrderField />
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
