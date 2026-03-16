import { useCreateFundDialogStore } from './useCreateFundDialogStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'
import { createFundDefaultValues } from './createFundDefaultValues'
import {
    createFundFormSchema,
    CreateFundFormValues,
} from './createFundForm.types'
import { useCreateFundMutation } from './useCreateFundMutation'

export function useCreateFundForm() {
    const close = useCreateFundDialogStore((s) => s.close)
    const { mutateAsync } = useCreateFundMutation()

    const form = useForm<CreateFundFormValues>({
        resolver: zodResolver(createFundFormSchema),
        defaultValues: createFundDefaultValues,
    })

    const handleError = useFormErrorHandler(form.setError)

    const onSubmit = async (formData: CreateFundFormValues) => {
        console.log(formData)

        await mutateAsync(formData, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Фонд успешно создан',
                })
                close()
            },
            onError: handleError,
        })
    }

    return { ...form, onSubmit }
}
