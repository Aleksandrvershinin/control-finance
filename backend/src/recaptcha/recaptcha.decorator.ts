import { SetMetadata } from '@nestjs/common'

export const RECAPTCHA_ACTION = 'recaptcha_action'

export const Recaptcha = (action: string) =>
    SetMetadata(RECAPTCHA_ACTION, action)
