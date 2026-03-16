import { FundsPage } from '@/pages/funds'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/funds')({
    component: RouteComponent,
})

function RouteComponent() {
    return <FundsPage />
}
