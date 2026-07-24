import { IsUUID } from 'class-validator'

export class UpdateUserDto {
    @IsUUID()
    currencyId!: string
}
