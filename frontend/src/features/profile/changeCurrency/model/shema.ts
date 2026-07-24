import { z } from 'zod'

export const selectCurrencySchema = z.object({
    currencyId: z.string().uuid({ message: 'Ошибка' }),
})

export type SelectCurrencyFormType = z.infer<typeof selectCurrencySchema>
