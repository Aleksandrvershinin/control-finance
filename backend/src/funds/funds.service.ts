import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { CreateFundDto } from './dto/create-fund.dto'
import { ReorderFundsDto } from './dto/reorderFunds.dto'
import { UpdateFundDto } from './dto/update-fund.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { mapFund, mapFunds } from './mappers/fund.mapper'

@Injectable()
export class FundsService {
    constructor(private prisma: PrismaService) {}

    private fundInclude(userId: string): Prisma.FundInclude {
        return {
            accountFundBalances: {
                where: {
                    account: { userId },
                },
                select: {
                    balance: true,
                },
            },
            user: {
                select: {
                    currencyId: true,
                },
            },
        }
    }

    async create(createFundDto: CreateFundDto, userId: string) {
        try {
            const fund = await this.prisma.fund.create({
                data: {
                    ...createFundDto,
                    userId,
                },
                include: this.fundInclude(userId),
            })

            return mapFund(fund)
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException('Название уже существует')
                }
            }

            throw error
        }
    }

    async findAll(userId: string) {
        const funds = await this.prisma.fund.findMany({
            where: { userId },
            orderBy: { order: 'asc' },
            include: this.fundInclude(userId),
        })

        return mapFunds(funds)
    }

    async reorder(dto: ReorderFundsDto, userId: string) {
        const fundIds = dto.items.map((item) => item.id)
        const uniqueFundIds = new Set(fundIds)

        if (uniqueFundIds.size !== fundIds.length) {
            throw new BadRequestException(
                'Duplicate fund ids in reorder payload',
            )
        }

        const funds = await this.prisma.fund.findMany({
            where: {
                userId,
                id: { in: fundIds },
            },
            select: { id: true },
        })

        if (funds.length !== fundIds.length) {
            throw new NotFoundException('Some funds were not found')
        }

        await this.prisma.$transaction(
            dto.items.map((item) =>
                this.prisma.fund.update({
                    where: { id: item.id },
                    data: { order: item.order },
                }),
            ),
        )

        return this.findAll(userId)
    }

    async update(id: string, updateFundDto: UpdateFundDto, userId: string) {
        try {
            const fund = await this.prisma.fund.update({
                where: {
                    id_userId: {
                        id,
                        userId,
                    },
                },
                data: updateFundDto,
                include: this.fundInclude(userId),
            })

            return mapFund(fund)
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Фонд не найден')
                }

                if (error.code === 'P2002') {
                    throw new BadRequestException('Название уже существует')
                }
            }

            throw error
        }
    }

    async remove(id: string, userId: string) {
        try {
            const fund = await this.prisma.fund.delete({
                where: {
                    id_userId: {
                        id,
                        userId,
                    },
                },
                include: this.fundInclude(userId),
            })

            return mapFund(fund)
        } catch (error) {
            if (error.code === 'P2025') {
                throw new BadRequestException('Фонд не найден')
            }
            throw error
        }
    }
}
