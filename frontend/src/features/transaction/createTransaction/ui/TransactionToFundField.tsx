import { useSuspenseFunds } from '@/entities/fund'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui'
import { useFormContext } from 'react-hook-form'
import { CreateTransactionFormValues } from '../model/createTransactionForm.types'

export const TransactionToFundField = () => {
    const {
        data: { funds },
    } = useSuspenseFunds()
    const form = useFormContext<CreateTransactionFormValues>()
    return (
        <>
            {funds.length > 0 && (
                <FormField
                    control={form.control}
                    name={'toFundId'}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Фонд зачисления</FormLabel>
                            <Select
                                required={false}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <FormControl>
                                    <SelectTrigger
                                        isClearable
                                        hasValue={!!field.value}
                                        onClear={() => field.onChange(null)}
                                    >
                                        <SelectValue placeholder="Выберите фонд на который поступят средства" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {funds.map((acc) => (
                                        <SelectItem key={acc.id} value={acc.id}>
                                            {acc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </>
    )
}
