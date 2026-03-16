import { FieldPath, UseFormSetError } from 'react-hook-form'
import { NormalizedError } from '../lib/errors/NormalizedError'

export function useFormErrorHandler<T extends Record<string, any>>(
    setError: UseFormSetError<T>,
) {
    return (error: unknown) => {
        if (error instanceof NormalizedError) {
            if (error.fieldErrors) {
                Object.entries(error.fieldErrors).forEach(
                    ([field, message]) => {
                        setError(field as FieldPath<T>, {
                            message: message.join(', '),
                        })
                    },
                )
            } else {
                console.log(error)
                setError('root', {
                    message: error.message,
                })
            }

            return
        }

        setError('root' as FieldPath<T>, {
            message: 'Неизвестная ошибка',
        })
    }
}
