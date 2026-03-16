import { ErrorSeverity } from './types'

export class NormalizedError {
    readonly message: string
    readonly severity: ErrorSeverity
    readonly fieldErrors?: Record<string, string[]>
    readonly code?: string
    readonly original: unknown

    constructor({
        message,
        original,
        severity,
        code,
        fieldErrors,
    }: {
        message: string
        severity: ErrorSeverity
        original: unknown
        fieldErrors?: Record<string, string[]>
        code?: string
    }) {
        this.original = original

        this.message = message
        this.severity = severity
        this.fieldErrors = fieldErrors
        this.code = code
    }

    isValidation() {
        return this.severity === 'validation'
    }

    isAuth() {
        return this.severity === 'auth'
    }

    isNetwork() {
        return this.severity === 'network'
    }
}
