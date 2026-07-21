import { FundSelect, useSuspenseFunds } from '@/entities/fund'
import { FormControl, FormField, FormItem, FormMessage } from '@/shared/ui'
import { useFormContext } from 'react-hook-form'
import {
    CreateIncomeExpenseFormValues,
    CreateTransferFundFormValues,
} from '../model/shema'

export const TransactionFundField = () => {
    const {
        data: { funds },
    } = useSuspenseFunds()
    const form = useFormContext<
        CreateIncomeExpenseFormValues | CreateTransferFundFormValues
    >()
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
                                    value={field.value ?? undefined}
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
