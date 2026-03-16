import { useSuspenseQuery } from '@tanstack/react-query'
import { fundApi } from '../api/fund.api'
import { FundType } from './fund.types'

export const useSuspenseFunds = () => {
    return useSuspenseQuery({
        ...fundApi.getFundsQueryOptions(),
        select: (funds) => {
            const fundsMap = new Map<string, FundType>()
            for (const fund of funds) fundsMap.set(fund.id, fund)
            return { funds, fundsMap }
        },
    })
}
