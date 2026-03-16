import { Button, type ButtonProps } from './button'

type PaginationDirection = 'prev' | 'next'

type PaginationButtonProps = ButtonProps & {
    direction: PaginationDirection
    label?: string
}

const directionLabel: Record<PaginationDirection, string> = {
    prev: '← Previous',
    next: 'Next →',
}

export const PaginationButton = ({
    direction,
    label,
    type = 'button',
    variant = 'outline',
    ...props
}: PaginationButtonProps) => {
    return (
        <Button type={type} variant={variant} {...props}>
            {label ?? directionLabel[direction]}
        </Button>
    )
}
