import { Form, FormRootMessage, LoadingButton, Stack } from '@/shared/ui'
import { useCreateFundForm } from '../model/useCreateFundForm'
import {
    FundNameField,
    FundOrderField,
    FundColorBgField,
} from '../../baseFundForm'

export function CreateFundForm() {
    const form = useCreateFundForm()
    const { onSubmit, ...formProps } = form

    const {
        formState: { isSubmitting },
    } = formProps

    return (
        <Form {...formProps}>
            <form
                onSubmit={formProps.handleSubmit(onSubmit)}
                className="space-y-6 w-full"
            >
                <FormRootMessage className="text-center" />
                <Stack spacing={6} direction={'column'}>
                    <FundNameField />
                    <FundOrderField />
                    <FundColorBgField />
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
