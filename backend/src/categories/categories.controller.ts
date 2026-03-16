// src/categories/categories.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseGuards,
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoriesService } from './categories.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Auth } from 'src/common/decorators/auth.decorator'
import { ResponseCategoryDto } from './dto/response-category.dto'
import { toResponse } from 'src/common/mappers/response.mapper'

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @Auth('userId') userId: string,
    ) {
        const category = await this.categoriesService.create(
            createCategoryDto,
            userId,
        )
        return {
            data: toResponse(ResponseCategoryDto, category),
        }
    }

    @Get()
    async findAll(@Auth('userId') userId: string) {
        const categories = await this.categoriesService.findAllForUser(userId)

        return {
            data: toResponse(ResponseCategoryDto, categories),
        }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Auth('userId') userId: string,
    ) {
        const category = await this.categoriesService.update(
            id,
            updateCategoryDto,
            userId,
        )
        return {
            data: toResponse(ResponseCategoryDto, category),
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Auth('userId') userId: string) {
        const category = await this.categoriesService.remove(id, userId)

        return {
            data: toResponse(ResponseCategoryDto, category),
        }
    }
}
