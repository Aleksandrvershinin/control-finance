import { useFormContext } from 'react-hook-form'
import {
    CategoryType,
    CategorySelect,
    useSuspenseCategories,
} from '@/entities/category'

import { FormControl, FormField, FormItem, FormMessage } from '@/shared/ui'

import { BaseTransactionFormValues } from '../model/baseTransactionForm.types'

export function TransactionCategoryField({ type }: { type: CategoryType }) {
    const form = useFormContext<BaseTransactionFormValues>()
    const {
        data: { categories },
    } = useSuspenseCategories()

    const filtered = categories.filter((cat) => cat.type === type)
    return (
        <FormField
            control={form.control}
            name={'categoryId'}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <CategorySelect
                            onChange={(value) => field.onChange(value || null)}
                            value={field.value ?? undefined}
                            options={filtered.map((cat) => ({
                                label: cat.name,
                                value: cat.id,
                            }))}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
