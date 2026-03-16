import { Exclude, Expose } from 'class-transformer'

export class ResponseUserDto {
    @Expose()
    id: string

    @Expose()
    email: string

    @Expose()
    currencyId: string

    @Exclude()
    password: string
}
