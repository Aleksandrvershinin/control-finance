import { AuthProvider } from '@prisma/client'

export interface JwtPayload {
    sub: string
    provider: AuthProvider
    providerId: string
}
