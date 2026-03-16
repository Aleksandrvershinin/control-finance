import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const { email, password, currencyId } = createUserDto

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            throw new BadRequestException(
                'Пользователь с этим email уже зарегистрирован',
            )
        }
        const existingCuryncy = await this.prisma.currency.findUnique({
            where: { id: currencyId },
        })
        if (!existingCuryncy) {
            throw new BadRequestException('Валюта не найдена')
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        try {
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    currency: {
                        connect: {
                            id: currencyId,
                        },
                    },
                },
                include: {
                    currency: true,
                },
            })

            return user
        } catch (error) {
            throw error
        }
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { currency: true },
        })
        if (!user) throw new NotFoundException('User not found')
        return user
    }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email: email },
        })
        if (!user) throw new BadRequestException('Email не найден')
        return user
    }
    // async findAll() {
    //     return this.prisma.user.findMany({
    //         include: { currency: true },
    //     })
    // }

    // async update(id: string, updateUserDto: UpdateUserDto) {
    //     if (updateUserDto.password) {
    //         updateUserDto.password = await bcrypt.hash(
    //             updateUserDto.password,
    //             10,
    //         )
    //     }
    //     return this.prisma.user.update({
    //         where: { id },
    //         data: updateUserDto,
    //     })
    // }

    // async remove(id: string) {
    //     return this.prisma.user.delete({ where: { id } })
    // }
}
