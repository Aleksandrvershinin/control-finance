import { Category } from '@/entities/category'
import { useUpdateCategoryDialogStore } from './useUpdateCategoryDialogStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'
import { useUpdateCategoryMutation } from './useUpdateCategoryMutation'
import { categoryFormSchema, CategoryFormValues } from '../../baseCategoryForm'

export function useUpdateCategoryForm(category: Category) {
    const close = useUpdateCategoryDialogStore((s) => s.close)
    const { mutateAsync } = useUpdateCategoryMutation()

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: category,
    })

    const handleError = useFormErrorHandler(form.setError)

    const onSubmit = async (formData: CategoryFormValues) => {
        await mutateAsync(
            {
                id: category.id,
                data: formData,
            },
            {
                onSuccess: () => {
                    toast({
                        variant: 'success',
                        title: 'Категория успешно обновлена',
                    })
                    close()
                },
                onError: handleError,
            },
        )
    }

    return { ...form, onSubmit }
}
