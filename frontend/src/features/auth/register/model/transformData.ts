import { WithRecaptcha } from '@/shared/types/WithRecaptcha'
import { RegisterFormType } from './register.types'

export function transformRegisterFormDataToDto(
    data: WithRecaptcha<RegisterFormType>,
) {
    const { confirmPassword, ...rest } = data
    return rest
}
