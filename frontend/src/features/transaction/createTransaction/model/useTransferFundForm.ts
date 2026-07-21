import { zodResolver } from '@hookform/resolvers/zod'
import {
    createTransferFundFormSchema,
    CreateTransferFundFormValues,
} from './shema'
import { useCreateTransactionDialogStore } from './useCreateTransactionDialogStore'
import { useCreateTransactionMutation } from './useCreateTransactionMutation'
import { DefaultValues, useForm } from 'react-hook-form'
import { useFormErrorHandler } from '@/shared/hooks/useFormErrorHandler'
import { toast } from '@/shared/hooks/use-toast'
import {
    DEFAULT_TRANSACTION_DATE,
    TRANSACTION_TYPES,
    TRANSFER_TYPES,
} from '@/entities/transaction'

const getDefaultValues = (): DefaultValues<CreateTransferFundFormValues> => {
    return {
        type: TRANSACTION_TYPES.TRANSFER,
        transferType: TRANSFER_TYPES.FUNDS,
        date: DEFAULT_TRANSACTION_DATE,
    }
}

export function useTransferFundForm() {
    const close = useCreateTransactionDialogStore((s) => s.close)
    const { mutateAsync } = useCreateTransactionMutation()

    const form = useForm<CreateTransferFundFormValues>({
        resolver: zodResolver(createTransferFundFormSchema),
        defaultValues: getDefaultValues(),
    })

    const handleError = useFormErrorHandler(form.setError)

    const onSubmit = async (formData: CreateTransferFundFormValues) => {
        await mutateAsync(formData, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Успешно',
                })
                close()
            },
            onError: handleError,
        })
    }

    return { ...form, onSubmit }
}
