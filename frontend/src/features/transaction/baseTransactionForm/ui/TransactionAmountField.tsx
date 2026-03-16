import { useFormContext } from 'react-hook-form'
import { BaseTransactionFormValues } from '../model/baseTransactionForm.types'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui'
import { AmountInput } from '@/shared/ui/AmountInput'

export const TransactionAmountField = ({
    allowNegative = false,
}: {
    allowNegative?: boolean
}) => {
    const form = useFormContext<BaseTransactionFormValues>()
    return (
        <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Сумма</FormLabel>
                    <FormControl>
                        <AmountInput
                            allowNegative={allowNegative}
                            {...field}
                            value={field.value ?? ''}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
