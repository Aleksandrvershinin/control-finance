import { useFormContext } from 'react-hook-form'

import { FormField, FormItem, FormControl, FormMessage } from '@/shared/ui'

import { CurrencySelect, useSuspenseCurrencies } from '@/entities/currency'

export const CurrencySelectField = () => {
    const { control } = useFormContext()
    const {
        data: { currencies },
    } = useSuspenseCurrencies()
    return (
        <FormField
            control={control}
            name={'currencyId'}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <CurrencySelect
                            {...field}
                            onChange={field.onChange}
                            value={field.value}
                            options={currencies.map((c) => ({
                                label: c.name,
                                value: c.id,
                            }))}
                        />
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
