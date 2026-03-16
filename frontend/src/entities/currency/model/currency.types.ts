import { z } from 'zod'

export const currencySchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    symbol: z.string(),
})

export type Currency = z.infer<typeof currencySchema>

export const defaultCurrency: Currency = {
    id: '22b7sws66362516-b722-4e9b-adc3-6503b8b18d94',
    name: 'Доллар США',
    code: 'USD',
    symbol: '$',
}
