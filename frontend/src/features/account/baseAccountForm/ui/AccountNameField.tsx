import {
    Input,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui'
import { Path } from 'react-hook-form'
import { AccountFormValues } from '../model/account.types'

interface AccountNameFieldProps {
    name?: Path<AccountFormValues>
}

export function AccountNameField({ name = 'name' }: AccountNameFieldProps) {
    return (
        <FormField
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Название счета</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
