import { FundMultiSelect, useSuspenseFunds } from '@/entities/fund'
import { useMainFilterStore } from '@/features/mainFilter'

export const FundFilterSection = () => {
    const {
        data: { funds },
    } = useSuspenseFunds()
    const { setFilter, filters } = useMainFilterStore()

    return (
        <FundMultiSelect
            options={funds.map((fund) => ({
                label: fund.name,
                value: fund.id,
            }))}
            value={filters.fundIds ?? []}
            onChange={(value) => setFilter('fundIds', value)}
        />
    )
}
