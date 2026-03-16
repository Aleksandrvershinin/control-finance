import { MySelect, MySelectProps } from '@/shared/ui'
import React from 'react'

type Props = MySelectProps

export const AccountSelect = React.forwardRef<HTMLButtonElement, Props>(
    ({ placeholder = 'Выберите счет', label = 'Счет', ...rest }, ref) => {
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

AccountSelect.displayName = 'AccountSelect'
