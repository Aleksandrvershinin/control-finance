import { Form, FormRootMessage, LoadingButton, Stack } from '@/shared/ui'
import { useUpdateCategoryForm } from '../model/useUpdateCategoryForm'
import { CategoryNameField, CategoryTypeField } from '../../baseCategoryForm'
import { Category } from '@/entities/category'

interface UpdateCategoryFormProps {
    category: Category
}

export function UpdateCategoryForm({ category }: UpdateCategoryFormProps) {
    const form = useUpdateCategoryForm(category)
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
                    <CategoryNameField />
                    <CategoryTypeField />
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
