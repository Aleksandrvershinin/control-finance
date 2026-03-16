import { Expose } from 'class-transformer'

export class ResponseFundDto {
    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    colorBg: string

    @Expose()
    order: string

    @Expose()
    amount: number

    @Expose()
    currencyId: string
}
