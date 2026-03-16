import { useCreateCategoryDialogStore } from './useCreateCategoryDialogStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'
import { createCategoryDefaultValues } from './createCategoryDefaultValues'
import { useCreateCategoryMutation } from './useCreateCategoryMutation'
import { categoryFormSchema, CategoryFormValues } from '../../baseCategoryForm'

export function useCreateCategoryForm() {
    const close = useCreateCategoryDialogStore((s) => s.close)
    const { mutateAsync } = useCreateCategoryMutation()

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: createCategoryDefaultValues,
    })

    const handleError = useFormErrorHandler(form.setError)

    const onSubmit = async (formData: CategoryFormValues) => {
        await mutateAsync(formData, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Категория успешно создана',
                })
                close()
            },
            onError: handleError,
        })
    }

    return { ...form, onSubmit }
}
