// src/categories/categories.service.ts
import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    async create(
        createCategoryDto: CreateCategoryDto,
        userId: string,
    ): Promise<Category> {
        try {
            return await this.prisma.category.create({
                data: { ...createCategoryDto, userId },
            })
        } catch (e) {
            if (e.code === 'P2002') {
                throw new BadRequestException(
                    'Категория с таким название уже существует',
                )
            }
            throw e
        }
    }

    async findAllForUser(userId: string): Promise<Category[]> {
        return this.prisma.category.findMany({
            where: { userId },
            orderBy: {
                type: 'asc',
            },
        })
    }

    async update(
        categoryId: Category['id'],
        updateCategoryDto: UpdateCategoryDto,
        userId: string,
    ): Promise<Category> {
        try {
            return await this.prisma.category.update({
                where: { id: categoryId, userId },
                data: updateCategoryDto,
            })
        } catch (e) {
            if (e.code === 'P2002') {
                throw new BadRequestException(
                    'Категория с таким название уже существует',
                )
            }
            throw e
        }
    }

    async remove(
        categoryId: Category['id'],
        userId: string,
    ): Promise<Category> {
        return this.prisma.category.delete({
            where: { id: categoryId, userId },
        })
    }
}
