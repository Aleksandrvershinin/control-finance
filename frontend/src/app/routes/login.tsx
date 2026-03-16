import { LoginPage } from '@/pages/login'
import { userApi } from '@/entities/user'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
    loader: async ({ context }) => {
        const { queryClient } = context
        const user = await queryClient.ensureQueryData(
            userApi.getCurrentUserQueryOptions(),
        )

        if (user) {
            throw redirect({ to: '/' })
        }
    },
    component: RouteComponent,
    validateSearch: (search) => ({
        method:
            search.method === 'code' || search.method === 'pass'
                ? search.method
                : 'pass',
    }),
})

function RouteComponent() {
    return (
        <>
            <LoginPage />
        </>
    )
}
