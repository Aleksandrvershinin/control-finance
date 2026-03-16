import * as React from 'react'

import { cn } from '@/shared/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

export type InputProps = React.ComponentProps<'input'>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'flex h-9 w-full rounded-md px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--primary-500] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-11 bg-[--text-white] text-[--text-black] border border-[--neutral-300] hover:bg-[--text-white]/60',
                    className,
                )}
                ref={ref}
                {...props}
            />
        )
    },
)
Input.displayName = 'Input'

type Props = React.ComponentProps<typeof Input>

const PasswordInput = React.forwardRef<HTMLInputElement, Props>(
    ({ className, ...props }, ref) => {
        const [show, setShow] = React.useState(false)

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type={show ? 'text' : 'password'}
                    className={cn('pr-9', className)}
                    {...props}
                />

                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShow((prev) => !prev)}
                    className="absolute right-0 top-0 h-full px-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                    {show ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>
        )
    },
)

PasswordInput.displayName = 'PasswordInput'

export { Input, PasswordInput }
