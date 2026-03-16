import { CreateAccountFormValues } from '../../createAccount/model/createAccount.types'
import { CreateAccountDto } from '@/entities/account'

export const transformAccountFormToDto = (
    form: CreateAccountFormValues,
): CreateAccountDto => {
    return {
        name: form.name,
        initialBalance: form.initialBalance,
        order: form.order,
    }
}
