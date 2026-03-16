import { currenciesApi } from '@/entities/currency'
import { userApi } from '@/entities/user'
import { RegisterPage } from '@/pages/register'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
    loader: async ({ context }) => {
        const { queryClient } = context
        const user = await queryClient.ensureQueryData(
            userApi.getCurrentUserQueryOptions(),
        )

        if (user) {
            throw redirect({ to: '/' })
        }

        await queryClient.ensureQueryData(
            currenciesApi.getCurrenciesQueryOptions(),
        )
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <RegisterPage />
}
