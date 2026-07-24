import { useSuspensCurrentUser } from '@/entities/user'
import { SelectCurrencyForm } from '@/features/profile/changeCurrency'
import { PropsWithChildren } from 'react'

export const ProfileProvider = ({ children }: PropsWithChildren) => {
    const { data: user } = useSuspensCurrentUser()

    if (user && !user.currencyId) {
        return <SelectCurrencyForm />
    }

    return children
}
