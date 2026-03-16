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

interface AccountOrderFieldProps {
    name?: Path<AccountFormValues>
}

export function AccountOrderField({ name = 'order' }: AccountOrderFieldProps) {
    return (
        <FormField
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Сортировка</FormLabel>
                    <FormControl>
                        <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
