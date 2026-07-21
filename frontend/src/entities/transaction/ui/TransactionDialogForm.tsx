import { MyDialog } from '@/shared/ui'
import { PropsWithChildren, ReactNode } from 'react'

interface Props extends PropsWithChildren {
    title: ReactNode
    isOpen: boolean
    callBack?: () => void
    onOpenChange?: (open: boolean) => void
}

export const TransactionDialogForm = ({
    title,
    isOpen,
    callBack,
    onOpenChange,
    children,
}: Props) => {
    return (
        <MyDialog
            isOpen={isOpen}
            handleOpenChange={onOpenChange ? onOpenChange : () => {}}
            onAnimationEnd={callBack}
            title={title}
        >
            {children}
        </MyDialog>
    )
}
