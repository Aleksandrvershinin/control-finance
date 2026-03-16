import { forwardRef } from 'react'
import { MySelect, MySelectProps } from '@/shared/ui'

type Props = MySelectProps

export const CategorySelect = forwardRef<HTMLButtonElement, Props>(
    (
        { placeholder = 'Выберите категорию', label = 'Категория', ...rest },
        ref,
    ) => {
        return (
            <MySelect
                label={label}
                ref={ref}
                placeholder={placeholder}
                {...rest}
            />
        )
    },
)

CategorySelect.displayName = 'CategorySelect'
