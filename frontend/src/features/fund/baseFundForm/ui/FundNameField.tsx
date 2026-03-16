import {
    Input,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui'
import { Path } from 'react-hook-form'
import { BaseFundFormValues } from '../model/baseFundForm.types'

interface FundNameFieldProps {
    name?: Path<BaseFundFormValues>
}

export function FundNameField({ name = 'name' }: FundNameFieldProps) {
    return (
        <FormField
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
