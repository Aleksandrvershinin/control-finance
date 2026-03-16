import { Currency, defaultCurrency as defCurrency } from './currency.types'
import { useSuspenseCurrencies } from './useSuspenseCurrencies'

export const useGetCurrencyById = () => {
    const {
        data: { currenciesMap },
    } = useSuspenseCurrencies()
    const getCurrencyByid = (
        currencyId?: string,
        defaultCurrency: Currency = defCurrency,
    ) => {
        const currency = currencyId
            ? currenciesMap.get(currencyId)
            : defaultCurrency

        return currency ?? defaultCurrency
    }

    return getCurrencyByid
}
