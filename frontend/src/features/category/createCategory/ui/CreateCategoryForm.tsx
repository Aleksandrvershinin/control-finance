import { Form, FormRootMessage, LoadingButton, Stack } from '@/shared/ui'
import { useCreateCategoryForm } from '../model/useCreateCategoryForm'
import { CategoryNameField, CategoryTypeField } from '../../baseCategoryForm'

export function CreateCategoryForm() {
    const form = useCreateCategoryForm()
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
                    <CategoryNameField />
                    <CategoryTypeField />
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
