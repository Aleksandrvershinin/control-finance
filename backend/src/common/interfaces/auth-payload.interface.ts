import { User } from '@prisma/client'

export interface AuthPayload {
    userId: User['id']
    userEmail: User['email']
}
