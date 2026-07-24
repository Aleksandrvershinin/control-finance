import { Body, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { MailService } from 'src/mail/mail.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { currency: true },
        })
        if (!user) throw new NotFoundException('User not found')
        return user
    }
    async update(@Auth('userId') userId: string, @Body() dto: UpdateUserDto) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                currencyId: dto.currencyId,
            },
        })
    }
}
