import { PropsWithChildren, ReactNode } from 'react'

interface Props extends PropsWithChildren {
    children: ReactNode
    onSubmit: React.FormEventHandler<HTMLFormElement>
}

export const TransactionForm = ({ children, onSubmit }: Props) => {
    return (
        <form onSubmit={onSubmit} className="w-full space-y-4">
            {children}
        </form>
    )
}
