import { CategoriesPage } from '@/pages/categories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/categories')({
    component: RouteComponent,
})

function RouteComponent() {
    return <CategoriesPage />
}
