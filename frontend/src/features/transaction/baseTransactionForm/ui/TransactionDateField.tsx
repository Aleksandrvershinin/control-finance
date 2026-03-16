import { useFormContext } from 'react-hook-form'
import { BaseTransactionFormValues } from '../model/baseTransactionForm.types'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
} from '@/shared/ui'

export const TransactionDateField = () => {
    const form = useFormContext<BaseTransactionFormValues>()
    return (
        <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Дата</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
