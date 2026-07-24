import { useQuery } from '@tanstack/react-query'
import { userApi } from '../api/user.api'

export const useCurrentUser = () => {
    return useQuery(userApi.getCurrentUserQueryOptions())
}
