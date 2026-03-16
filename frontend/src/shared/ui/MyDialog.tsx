import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog'
import React from 'react'

interface Props {
    isOpen: boolean
    handleOpenChange: (open: boolean) => void
    title?: React.ReactNode
    footer?: React.ReactNode
    onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
    children: React.ReactNode
}

export const MyDialog = ({
    isOpen,
    handleOpenChange,
    title,
    footer,
    children,
    onAnimationEnd,
}: Props) => {
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent onAnimationEnd={onAnimationEnd}>
                {title && (
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            <div className="text-3xl font-semibold space-x-4">
                                {title}
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                )}
                {children}
                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    )
}
