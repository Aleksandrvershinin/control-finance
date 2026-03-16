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

interface FundOrderFieldProps {
    name?: Path<BaseFundFormValues>
}

export function FundOrderField({ name = 'order' }: FundOrderFieldProps) {
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
