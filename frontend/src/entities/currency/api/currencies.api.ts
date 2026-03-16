import { apiAxios } from '@/shared/api/axiosInstance'
import { currencySchema } from '../model/currency.types'
import { queryOptions } from '@tanstack/react-query'

export const currenciesApi = {
    getCurrenciesQueryOptions: () => {
        return queryOptions({
            queryKey: ['currencies', 'list'],
            queryFn: async () => {
                const res = await apiAxios.get('/currencies')
                return currencySchema
                    .array()
                    .nonempty()
                    .parse(res.data.data || res.data)
            },
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        })
    },
}
