import { AccountSelect, useSuspenseAccounts } from '@/entities/account'

import { useFormContext } from 'react-hook-form'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui'
import {
    CreateIncomeExpenseFormValues,
    CreateTransferFormValues,
} from '../model/shema'

export const TransactionAccountField = ({
    lable,
    name,
}: {
    name: 'accountId' | 'toAccountId'
    lable: string
}) => {
    const form = useFormContext<
        CreateIncomeExpenseFormValues | CreateTransferFormValues
    >()
    const {
        data: { accounts },
    } = useSuspenseAccounts()

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <AccountSelect
                            label={<FormLabel>{lable}</FormLabel>}
                            options={accounts.map((acc) => ({
                                label: acc.name,
                                value: acc.id,
                            }))}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
