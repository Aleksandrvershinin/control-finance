import { FundSelect, useSuspenseFunds } from '@/entities/fund'
import { FormControl, FormField, FormItem, FormMessage } from '@/shared/ui'
import { useFormContext } from 'react-hook-form'
import { CreateTransactionFormValues } from '../model/createTransactionForm.types'

export const TransactionFundField = () => {
    const {
        data: { funds },
    } = useSuspenseFunds()
    const form = useFormContext<CreateTransactionFormValues>()
    return (
        <>
            {funds.length > 0 && (
                <FormField
                    control={form.control}
                    name={'fundId'}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <FundSelect
                                    isClearable
                                    {...field}
                                    options={funds.map((fund) => ({
                                        label: fund.name,
                                        value: fund.id,
                                    }))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </>
    )
}
