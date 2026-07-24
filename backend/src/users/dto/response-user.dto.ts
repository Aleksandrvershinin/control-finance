import { Expose } from 'class-transformer'

export class ResponseUserDto {
    @Expose()
    id!: string

    @Expose()
    currencyId!: string | null
}
