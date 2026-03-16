import { UpdateAccountDto } from '@/entities/account'
import { UpdateAccountFormValues } from './updateAccount.types'

export const transformUpdateAccountFormToUpdateAccountDto = (
    form: UpdateAccountFormValues,
): UpdateAccountDto => {
    return {
        name: form.name,
        order: form.order,
    }
}
