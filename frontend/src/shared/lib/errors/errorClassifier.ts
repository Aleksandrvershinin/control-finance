import { ErrorSeverity } from './types'

export function classifyStatus(status?: number): ErrorSeverity {
    if (!status) return 'network'

    if (status === 400) return 'validation'
    if (status === 401) return 'auth'
    if (status === 403) return 'forbidden'
    if (status === 404) return 'notFound'
    if (status >= 500) return 'server'

    return 'unknown'
}
