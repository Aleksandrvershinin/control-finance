import { FormControl, FormField, FormItem, FormMessage } from '@/shared/ui'

import { Path } from 'react-hook-form'
import { categoriesTypeMeta } from '@/entities/category/model/categoryTypeMeta.types'
import { CategoryFormValues } from '../model/baseCategoryForm.types'
import { CategoryTypeMetaSelect } from '@/entities/category'

interface CategoryTypeFieldProps {
    name?: Path<CategoryFormValues>
}

export function CategoryTypeField({ name = 'type' }: CategoryTypeFieldProps) {
    return (
        <FormField
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <CategoryTypeMetaSelect
                            {...field}
                            onChange={field.onChange}
                            value={field.value}
                            options={categoriesTypeMeta.map((type) => ({
                                label: type.name,
                                value: type.type,
                            }))}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
