import { Form, FormRootMessage, LoadingButton, Stack } from '@/shared/ui'
import { FundType } from '@/entities/fund'
import { useUpdateFundForm } from '../model/useUpdateFundForm'
import {
    FundNameField,
    FundOrderField,
    FundColorBgField,
} from '../../baseFundForm'

interface UpdateFundFormProps {
    fund: FundType
}

export function UpdateFundForm({ fund }: UpdateFundFormProps) {
    const form = useUpdateFundForm(fund)
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
                    Обновить
                </LoadingButton>
            </form>
        </Form>
    )
}
