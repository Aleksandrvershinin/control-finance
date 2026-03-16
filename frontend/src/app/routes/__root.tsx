import {
    createRootRoute,
    ErrorComponentProps,
    Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { logError } from '@/shared/lib/utils/logError'
import { ErrorPage } from '@/pages/error'
import { queryClient } from '@/shared/lib/utils/queryСlient'
import { AuthProvider } from '../providers/AuthProvider'

export const Route = createRootRoute({
    context: () => ({ queryClient }),
    component: RootComponent,
    errorComponent: ErrorComponent,
})

function RootComponent() {
    return (
        <>
            <AuthProvider>
                <Outlet />
            </AuthProvider>
            <TanStackRouterDevtools position="bottom-left" />
        </>
    )
}

function ErrorComponent({ error, reset, info }: ErrorComponentProps) {
    logError(error, info)
    return <ErrorPage error={error} info={info} reset={reset} />
}
