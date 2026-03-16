import { Expose } from 'class-transformer'

export class ResponseAccountDto {
    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    order: number

    @Expose()
    balance: number

    @Expose()
    initialBalance: number

    @Expose()
    currencyId: string

    @Expose()
    funds: {
        id: string
        name: string
        colorBg: string
        balance: number
    }[]
}
