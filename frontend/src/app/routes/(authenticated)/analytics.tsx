import { AnalyticsPage } from '@/pages/analytics'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/analytics')({
    component: RouteComponent,
})

function RouteComponent() {
    return <AnalyticsPage />
}
