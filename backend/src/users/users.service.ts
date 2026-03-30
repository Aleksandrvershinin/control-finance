import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { ConfirmChangePasswordDto } from './dto/confirm-change-password.dto'
import { MailService } from 'src/mail/mail.service'

type PasswordChangeCodeRecord = {
    id: string
    type: 'PASSWORD_CHANGE'
    channel: 'EMAIL'
    target: string
    codeHash: string
    expireAt: Date
    requestedAt: Date
    consumedAt: Date | null
    attemptCount: number
    lastAttemptAt: Date | null
    userId: string | null
}

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private readonly mailService: MailService,
    ) {}

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

    async requestChangePasswordCode(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const existingCode = await this.prisma.verificationCode.findFirst({
            where: {
                userId: userId,
                type: 'PASSWORD_CHANGE',
                channel: 'EMAIL',
                consumedAt: null,
            },
        })

        const THROTTLE_TTL = 2 * 60 * 1000
        if (
            existingCode &&
            existingCode.requestedAt.getTime() + THROTTLE_TTL > Date.now()
        ) {
            throw new BadRequestException(
                'Повторная отправка возможна через 2 минуты',
            )
        }

        const code = this.generateCode()
        const changePasswordCodeHash = await bcrypt.hash(code, 10)

        await this.mailService.sendChangePasswordCode(user.email, code)

        const expireAt = new Date(Date.now() + 10 * 60 * 1000)
        const requestedAt = new Date()

        await this.prisma.verificationCode.upsert({
            where: {
                type_channel_target: {
                    type: 'PASSWORD_CHANGE',
                    channel: 'EMAIL',
                    target: user.email,
                },
            },
            create: {
                type: 'PASSWORD_CHANGE',
                channel: 'EMAIL',
                target: user.email,
                codeHash: changePasswordCodeHash,
                expireAt,
                requestedAt,
                attemptCount: 0,
                userId,
            },
            update: {
                codeHash: changePasswordCodeHash,
                expireAt,
                requestedAt,
                attemptCount: 0,
                consumedAt: null,
                lastAttemptAt: null,
                userId,
            },
        })

        return { success: true, message: 'Код был отправлен' }
    }

    async confirmChangePassword(userId: string, dto: ConfirmChangePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const passwordChangeCode = await this.prisma.verificationCode.findFirst(
            {
                where: {
                    userId,
                    type: 'PASSWORD_CHANGE',
                    channel: 'EMAIL',
                    consumedAt: null,
                },
            },
        )

        if (!passwordChangeCode) {
            throw new BadRequestException('Сначала запросите код')
        }

        if (passwordChangeCode.expireAt < new Date()) {
            throw new BadRequestException('Время действия кода истекло')
        }

        const isValidCode = await bcrypt.compare(
            dto.code,
            passwordChangeCode.codeHash,
        )

        if (!isValidCode) {
            const now = new Date()
            await this.prisma.verificationCode.update({
                where: {
                    id: passwordChangeCode.id,
                },
                data: {
                    attemptCount: {
                        increment: 1,
                    },
                    lastAttemptAt: now,
                    updatedAt: now,
                },
            })

            throw new BadRequestException('Неверный код')
        }

        const isSamePassword = await bcrypt.compare(
            dto.newPassword,
            user.password,
        )

        if (isSamePassword) {
            throw new BadRequestException(
                'Новый пароль должен отличаться от текущего',
            )
        }

        const password = await bcrypt.hash(dto.newPassword, 10)
        const now = new Date()
        await this.prisma.$transaction([
            // Обновляем пароль пользователя
            this.prisma.user.update({
                where: { id: userId },
                data: { password },
            }),

            // Отмечаем код как использованный
            this.prisma.verificationCode.update({
                where: { id: passwordChangeCode.id },
                data: {
                    consumedAt: now,
                },
            }),
        ])

        return { success: true }
    }

    private generateCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString()
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
