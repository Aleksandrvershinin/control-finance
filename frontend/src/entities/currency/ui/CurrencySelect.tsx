import { forwardRef } from 'react'
import { MySelect, MySelectProps } from '@/shared/ui'

type Props = MySelectProps

export const CurrencySelect = forwardRef<HTMLButtonElement, Props>(
    ({ placeholder = 'Выберите валюту', label = 'Валюта', ...rest }, ref) => {
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

CurrencySelect.displayName = 'CurrencySelect'
