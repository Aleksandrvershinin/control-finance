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

export const TransactionCommentField = () => {
    const form = useFormContext<BaseTransactionFormValues>()
    return (
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Комментарий (опционально)</FormLabel>
                    <FormControl>
                        <Input
                            type="text"
                            placeholder="Комментарий"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
