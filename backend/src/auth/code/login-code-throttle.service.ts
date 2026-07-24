import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class LoginCodeThrottleService {
    constructor(private readonly prisma: PrismaService) {}

    async consume(ip: string) {
        const ttl = 2 * 60 * 1000
        const thresholdDate = new Date(Date.now() - ttl)

        await this.prisma.codeThrottle.deleteMany({
            where: {
                createdAt: {
                    lt: thresholdDate,
                },
            },
        })

        const activeThrottle = await this.prisma.codeThrottle.findFirst({
            where: {
                ip,
                createdAt: {
                    gte: thresholdDate,
                },
            },
        })

        if (activeThrottle) {
            throw new BadRequestException(
                'Повторная отправка возможна через 2 минуты',
            )
        }

        await this.prisma.codeThrottle.create({
            data: {
                ip,
            },
        })
    }
}
