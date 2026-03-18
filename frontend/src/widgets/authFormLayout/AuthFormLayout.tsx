import { Stack } from '@/shared/ui/Stack'
import { ReactNode } from 'react'

type AuthFormLayoutProps = {
    title: string
    children: ReactNode
    footer: ReactNode
}

export const AuthFormLayout = ({
    title,
    children,
    footer,
}: AuthFormLayoutProps) => {
    return (
        <section>
            <div className="container">
                <Stack
                    direction={'column'}
                    className="mt-20 mx-auto w-full max-w-96 rounded-lg bg-white p-4 shadow-2xl"
                >
                    <h1 className="mb-4 text-center text-2xl font-semibold">
                        {title}
                    </h1>
                    {children}
                    {footer}
                </Stack>
            </div>
        </section>
    )
}
