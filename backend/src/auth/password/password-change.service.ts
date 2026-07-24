import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { AuthProvider } from '@prisma/client'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthMethodsService } from '../providers/auth-methods.service'
import { CodeService } from '../code/code.service'
import { PasswordService } from './password.service'
import { ConfirmChangePasswordDto } from '../dto/confirm-change-password.dto'

@Injectable()
export class PasswordChangeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authMethodsService: AuthMethodsService,
        private readonly passwordService: PasswordService,
        private readonly codeService: CodeService,
        private readonly mailService: MailService,
    ) {}

    async requestCode(userId: string) {
        const authMethod = await this.authMethodsService.findByUserId(
            userId,
            AuthProvider.EMAIL,
        )
        if (!authMethod) {
            throw new NotFoundException('Email authentication not found')
        }

        const existingCode = await this.prisma.verificationCode.findFirst({
            where: {
                authMethodId: authMethod.id,
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

        const { plainCode, codeHash } = await this.codeService.create()

        await this.mailService.sendChangePasswordCode(
            authMethod.providerId,
            plainCode,
        )

        const expireAt = new Date(Date.now() + 10 * 60 * 1000)
        const requestedAt = new Date()

        await this.prisma.verificationCode.upsert({
            where: {
                type_channel_target: {
                    type: 'PASSWORD_CHANGE',
                    channel: 'EMAIL',
                    target: authMethod.providerId,
                },
            },
            create: {
                type: 'PASSWORD_CHANGE',
                channel: 'EMAIL',
                target: authMethod.providerId,
                codeHash,
                expireAt,
                requestedAt,
                attemptCount: 0,
                authMethodId: authMethod.id,
            },
            update: {
                codeHash,
                expireAt,
                requestedAt,
                attemptCount: 0,
                consumedAt: null,
                lastAttemptAt: null,
                authMethodId: authMethod.id,
            },
        })

        return {
            success: true,
            message: 'Код был отправлен',
        }
    }

    async changePassword(userId: string, dto: ConfirmChangePasswordDto) {
        const authMethod = await this.authMethodsService.findByUserId(
            userId,
            AuthProvider.EMAIL,
        )

        if (!authMethod || !authMethod.passwordHash) {
            throw new NotFoundException('Email authentication not found')
        }

        const passwordChangeCode = await this.prisma.verificationCode.findFirst(
            {
                where: {
                    authMethodId: authMethod.id,
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

        const isValidCode = await this.codeService.verify(
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

        const isSamePassword = await this.passwordService.verify(
            dto.newPassword,
            authMethod.passwordHash,
        )

        if (isSamePassword) {
            throw new BadRequestException(
                'Новый пароль должен отличаться от текущего',
            )
        }

        const passwordHash = await this.passwordService.hash(dto.newPassword)

        const now = new Date()

        await this.prisma.$transaction(async (tx) => {
            await tx.authMethod.update({
                where: {
                    id: authMethod.id,
                },
                data: {
                    passwordHash,
                },
            })

            await tx.verificationCode.update({
                where: {
                    id: passwordChangeCode.id,
                },
                data: {
                    consumedAt: now,
                },
            })
        })

        return {
            success: true,
        }
    }
}
