import { FileRoutesByTo } from '@/app/routeTree.gen'

export type NavigationItem = {
    path: keyof FileRoutesByTo
    label: string
}
export const NAVIGATION_ITEMS: NavigationItem[] = [
    { path: '/', label: 'Домой' },
    { path: '/analytics', label: 'Аналитика' },
    { path: '/funds', label: 'Фонды' },
    { path: '/categories', label: 'Категории' },
]
