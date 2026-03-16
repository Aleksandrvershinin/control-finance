import { useLocation } from '@tanstack/react-router'

export function useSearchQuery() {
    const { search } = useLocation()
    return new URLSearchParams(search)
}
