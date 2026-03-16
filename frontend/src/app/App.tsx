import { QueryClientProvider } from '@tanstack/react-query'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { queryClient } from '@/shared/lib/utils/queryСlient'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { FullScreenSpinner } from '@/shared/ui/FullScreenSpinner'
import { NotFoundPage } from '@/pages/notFound'
import { Toaster } from '@/shared/ui/Toaster'
export interface RouterHistoryState {
    from?: string
}
const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPendingMs: 0,
    defaultPendingComponent: FullScreenSpinner,
    defaultNotFoundComponent: NotFoundPage,
})
declare module '@tanstack/react-router' {
    interface HistoryState {
        from?: string
    }
    interface Register {
        router: typeof router
    }
}
function App() {
    const reCaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

    return (
        <QueryClientProvider client={queryClient}>
            <GoogleReCaptchaProvider language="ru" reCaptchaKey={reCaptchaKey}>
                <Toaster />
                <RouterProvider router={router} />
            </GoogleReCaptchaProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App
