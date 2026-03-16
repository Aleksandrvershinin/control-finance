import axios from 'axios'
import { ERROR_MESSAGES } from './errorMessages'
import { ErrorSeverity } from './types'
import { classifyStatus } from './errorClassifier'
import { responseErrorSchema } from '@/shared/api/api.types'
import { NormalizedError } from './NormalizedError'

function parseErrorData(error: unknown) {
    if (!axios.isAxiosError(error)) {
        console.error(error)

        return {
            message: ERROR_MESSAGES.unknown,
            severity: 'unknown' as ErrorSeverity,
        }
    }

    const status = error.response?.status
    const data = error.response?.data

    const severity = classifyStatus(status)

    if (!status) {
        console.error(error)
        return {
            message: ERROR_MESSAGES.network,
            severity: 'network' as ErrorSeverity,
        }
    }

    if (status === 400) {
        const parsed = responseErrorSchema.safeParse(data)

        if (parsed.success) {
            return {
                message: parsed.data.message || ERROR_MESSAGES[severity],
                fieldErrors: parsed.data.errors,
                code: parsed.data.error,
                severity,
            }
        } else {
            return {
                message:
                    error.response?.data?.message || ERROR_MESSAGES[severity],
                severity,
            }
        }
    }

    return {
        message: ERROR_MESSAGES[severity] ?? ERROR_MESSAGES.unknown,
        severity,
    }
}
export function normalizeError(error: unknown) {
    const parsed = parseErrorData(error)
    return new NormalizedError({
        ...parsed,
        original: error,
    })
}
