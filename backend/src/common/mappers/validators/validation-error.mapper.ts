import { ValidationError } from '@nestjs/common'
import { validationMessageMap } from './validation-messages'

export function mapValidationErrors(
    errors: ValidationError[],
): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {}

    errors.forEach((error) => {
        const constraints = error.constraints ?? {}

        const messages: string[] = []

        Object.keys(constraints).forEach((rule) => {
            const handler = validationMessageMap[rule]

            if (handler) {
                messages.push(handler(error))
            } else {
                messages.push(constraints[rule])
            }
        })

        if (messages.length) {
            formattedErrors[error.property] = messages
        }
    })

    return formattedErrors
}
