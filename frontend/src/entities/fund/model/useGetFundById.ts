import { FundType } from './fund.types'
import { useSuspenseFunds } from './useSuspenseFunds'

export const useGetFundById = () => {
    const {
        data: { fundsMap },
    } = useSuspenseFunds()
    const getFundById = (fundId: string): FundType | null => {
        const fund = fundsMap.get(fundId)
        return fund ?? null
    }

    return getFundById
}
