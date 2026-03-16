import { useSuspenseQuery } from '@tanstack/react-query'
import { userApi } from '../api/user.api'

export const useSuspensCurrentUser = () => {
    return useSuspenseQuery(userApi.getCurrentUserQueryOptions())
}
