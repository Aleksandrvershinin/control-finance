import { forwardRef } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { Input } from './input'

interface AmountInputProps extends NumericFormatProps {}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
    (
        {
            value,
            placeholder = '0.00',
            thousandSeparator = ' ',
            decimalSeparator = '.',
            allowNegative = false,
            ...props
        },
        ref,
    ) => {
        return (
            <NumericFormat
                value={value}
                thousandSeparator={thousandSeparator}
                decimalSeparator={decimalSeparator}
                allowNegative={allowNegative}
                placeholder={placeholder}
                getInputRef={ref}
                customInput={Input}
                {...props}
            />
        )
    },
)

AmountInput.displayName = 'AmountInput'
