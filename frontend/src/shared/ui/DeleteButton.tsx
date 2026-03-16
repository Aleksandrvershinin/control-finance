import { cn } from '@/shared/lib/utils'
import { Trash2 } from 'lucide-react'
import { ComponentProps } from 'react'

interface Props extends ComponentProps<'button'> {
    title?: string
    iconProps?: ComponentProps<typeof Trash2>
}

export type DeleteButtonProps = Props

export const DeleteButton = ({
    children,
    title = 'Удалить',
    iconProps,
    ...rest
}: Props) => {
    return (
        <button title={title} {...rest}>
            {children}
            <Trash2
                size={iconProps?.size ?? 23}
                className={cn('text-[--error-500] ml-2', iconProps?.className)}
                {...iconProps}
            />
        </button>
    )
}
