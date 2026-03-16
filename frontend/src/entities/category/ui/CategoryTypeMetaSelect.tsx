import { MySelect, MySelectProps } from '@/shared/ui'
import React from 'react'

type Props = MySelectProps

export const CategoryTypeMetaSelect = React.forwardRef<
    HTMLButtonElement,
    Props
>(
    (
        {
            placeholder = 'Выберите тип категории',
            label = 'Тип категории',
            ...rest
        },
        ref,
    ) => {
        return (
            <MySelect
                ref={ref}
                label={label}
                placeholder={placeholder}
                {...rest}
            />
        )
    },
)

CategoryTypeMetaSelect.displayName = 'CategoryTypeMetaSelect'
