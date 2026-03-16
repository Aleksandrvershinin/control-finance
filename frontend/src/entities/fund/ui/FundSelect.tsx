import { MySelect, MySelectProps } from '@/shared/ui'
import React from 'react'

type Props = MySelectProps

export const FundSelect = React.forwardRef<HTMLButtonElement, Props>(
    ({ placeholder = 'Выберите фонд', label = 'Фонд', ...rest }, ref) => {
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

FundSelect.displayName = 'FundSelect'
