export type ErrorSeverity =
    | 'network'
    | 'validation'
    | 'auth'
    | 'forbidden'
    | 'notFound'
    | 'server'
    | 'unknown'

export interface NormalizedError {
    message: string
    severity: ErrorSeverity
    fieldErrors?: Record<string, string[]>
    original: unknown
}
