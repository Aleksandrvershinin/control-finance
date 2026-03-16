import {
    Input,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui'
import { Path } from 'react-hook-form'
import { CategoryFormValues } from '../model/baseCategoryForm.types'

interface CategoryNameFieldProps {
    name?: Path<CategoryFormValues>
}

export function CategoryNameField({ name = 'name' }: CategoryNameFieldProps) {
    return (
        <FormField
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Название категории</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
