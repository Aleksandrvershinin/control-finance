import { useFormContext } from 'react-hook-form'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui'
import { AmountInput } from '@/shared/ui/AmountInput'
import { CreateAccountFormValues } from '../model/createAccount.types'

export const AccountInitialBalanceField = () => {
    const form = useFormContext<CreateAccountFormValues>()
    return (
        <FormField
            control={form.control}
            name="initialBalance"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Начальный баланс</FormLabel>
                    <FormControl>
                        <AmountInput allowNegative={true} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
