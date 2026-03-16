import { cn } from '@/shared/lib/utils'
import { Edit } from 'lucide-react'
import { ComponentProps } from 'react'

interface Props extends ComponentProps<'button'> {
    title?: string
    iconProps?: ComponentProps<typeof Edit>
}

export type EditButtonProps = Props

export const EditButton = ({
    children,
    title = 'Редактировать',
    iconProps,
    ...rest
}: Props) => {
    return (
        <button title={title} {...rest}>
            {children}
            <Edit
                size={iconProps?.size ?? 23}
                className={cn('text-blue-500 ml-2', iconProps?.className)}
                {...iconProps}
            />
        </button>
    )
}
