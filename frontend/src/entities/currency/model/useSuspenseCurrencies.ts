import { useSuspenseQuery } from '@tanstack/react-query'
import { currenciesApi } from '../api/currencies.api'
import { Currency } from './currency.types'

export const useSuspenseCurrencies = () => {
    return useSuspenseQuery({
        ...currenciesApi.getCurrenciesQueryOptions(),
        select: (currencies) => {
            const currenciesMap = new Map<string, Currency>()
            for (const c of currencies) currenciesMap.set(c.id, c)
            return { currencies, currenciesMap }
        },
    })
}
