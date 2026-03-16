import axios from 'axios'
import { errorResponseSchema } from '../types/errors.tyes'
import { ERROR_MESSAGES } from '../configs/сonfig'

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error) && error.response) {
        const parsedError = errorResponseSchema.safeParse(error.response.data)
        if (parsedError.success && parsedError.data) {
            return Array.isArray(parsedError.data.message)
                ? parsedError.data.message[0]
                : parsedError.data.message
        }
    }
    return error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR
}
