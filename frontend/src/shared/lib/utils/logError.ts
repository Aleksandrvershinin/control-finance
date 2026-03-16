import { ErrorInfo } from 'react'

export function logError(error: unknown, info?: ErrorInfo) {
    const err = error instanceof Error ? error : new Error('Unknown error')

    if (process.env.NODE_ENV === 'development') {
        console.log('Caught error:', err)
        console.log('Component stack:', info?.componentStack)
    } else {
        // Production logging service
        // monitoringService.captureException(err, info);
    }
}
