import { FundType } from '@/entities/fund'
import { useUpdateFundDialogStore } from './useUpdateFundDialogStore'
import {
    updateFundFormSchema,
    UpdateFundFormValues,
} from './updateFundForm.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'
import { useUpdateFundMutation } from './useUpdateFundMutation'

export function useUpdateFundForm(fund: FundType) {
    const close = useUpdateFundDialogStore((s) => s.close)
    const { mutateAsync } = useUpdateFundMutation()

    const form = useForm<UpdateFundFormValues>({
        resolver: zodResolver(updateFundFormSchema),
        defaultValues: fund,
    })

    const handleError = useFormErrorHandler(form.setError)

    const onSubmit = async (formData: UpdateFundFormValues) => {
        await mutateAsync(
            {
                id: fund.id,
                data: formData,
            },
            {
                onSuccess: () => {
                    toast({
                        variant: 'success',
                        title: 'Фонд успешно обновлён',
                    })
                    close()
                },
                onError: handleError,
            },
        )
    }

    return { ...form, onSubmit }
}
