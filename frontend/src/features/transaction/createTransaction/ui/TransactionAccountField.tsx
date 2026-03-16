import { AccountSelect, useSuspenseAccounts } from '@/entities/account'

import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage } from '@/shared/ui'
import { CreateTransactionFormValues } from '../model/createTransactionForm.types'

export const TransactionAccountField = ({
    lable,
    name,
}: {
    name: 'accountId' | 'toAccountId'
    lable: string
}) => {
    const form = useFormContext<CreateTransactionFormValues>()
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
                            label={lable}
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
