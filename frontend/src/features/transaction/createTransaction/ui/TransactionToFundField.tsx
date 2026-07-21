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
import { CreateTransferFundFormValues } from '../model/shema'

export const TransactionToFundField = () => {
    const {
        data: { funds },
    } = useSuspenseFunds()
    const form = useFormContext<CreateTransferFundFormValues>()
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
                                value={field.value ?? undefined}
                                onValueChange={field.onChange}
                            >
                                <FormControl>
                                    <SelectTrigger
                                        isClearable
                                        hasValue={!!field.value}
                                        onClear={() => field.onChange(null)}
                                    >
                                        <SelectValue placeholder="Без фонда" />
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
