import { Expose } from 'class-transformer'

export class ResponseCurrencyDto {
    @Expose()
    id: number

    @Expose()
    name: string

    @Expose()
    code: string

    @Expose()
    symbol: string
}
