import { MainLayout } from '@/app/layout/MainLayout'
import { accountApi } from '@/entities/account'
import { categoryApi } from '@/entities/category'
import { currenciesApi } from '@/entities/currency'
import { fundApi } from '@/entities/fund'
import { userApi } from '@/entities/user'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)')({
    loader: async ({ context, location }) => {
        const { queryClient } = context
        const user = await queryClient.ensureQueryData(
            userApi.getCurrentUserQueryOptions(),
        )

        if (!user) {
            throw redirect({
                to: '/login',
                search: { method: 'pass' },
                state: { from: location.publicHref },
            })
        }
        queryClient.prefetchQuery(categoryApi.getCategoriesQueryOptions())
        queryClient.prefetchQuery(accountApi.getAccountsQueryOptions())
        queryClient.prefetchQuery(fundApi.getFundsQueryOptions())
        queryClient.prefetchQuery(currenciesApi.getCurrenciesQueryOptions())
    },
    component: ProtectedLayout,
})

function ProtectedLayout() {
    return <MainLayout />
}
