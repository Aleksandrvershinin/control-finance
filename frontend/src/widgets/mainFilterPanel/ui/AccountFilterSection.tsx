import { AccountMultiSelect, useSuspenseAccounts } from '@/entities/account'
import { useMainFilterStore } from '@/features/mainFilter'

export const AccountFilterSection = () => {
    const {
        data: { accounts },
    } = useSuspenseAccounts()
    const { setFilter, filters } = useMainFilterStore()

    return (
        <AccountMultiSelect
            options={accounts.map((acc) => ({
                label: acc.name,
                value: acc.id,
            }))}
            value={filters.accountIds ?? []}
            onChange={(value) => setFilter('accountIds', value)}
        />
    )
}
