import { Injectable } from '@nestjs/common'
import { AuthProvider, Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AuthMethodsService {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string) {
        return this.prisma.authMethod.findUnique({
            where: {
                id,
            },
            include: {
                user: true,
            },
        })
    }

    async findByProvider(provider: AuthProvider, providerId: string) {
        return this.prisma.authMethod.findUnique({
            where: {
                provider_providerId: {
                    provider,
                    providerId,
                },
            },
            include: {
                user: true,
            },
        })
    }

    async findByUserId(userId: string, provider?: AuthProvider) {
        return this.prisma.authMethod.findFirst({
            where: {
                userId,
                ...(provider ? { provider } : {}),
            },
            include: {
                user: true,
            },
        })
    }

    async create(data: Prisma.AuthMethodCreateInput) {
        return this.prisma.authMethod.create({
            data,
        })
    }

    async update(id: string, data: Prisma.AuthMethodUpdateInput) {
        return this.prisma.authMethod.update({
            where: {
                id,
            },
            data,
        })
    }

    async delete(id: string) {
        return this.prisma.authMethod.delete({
            where: {
                id,
            },
        })
    }
}
