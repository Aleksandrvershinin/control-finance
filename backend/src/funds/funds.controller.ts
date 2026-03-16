import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common'
import { FundsService } from './funds.service'
import { CreateFundDto } from './dto/create-fund.dto'
import { UpdateFundDto } from './dto/update-fund.dto'
import { ReorderFundsDto } from './dto/reorderFunds.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Auth } from 'src/common/decorators/auth.decorator'
import { ResponseFundDto } from './dto/response-fund.dto'
import { toResponse } from 'src/common/mappers/response.mapper'

@Controller('funds')
@UseGuards(JwtAuthGuard)
export class FundsController {
    constructor(private readonly fundsService: FundsService) {}

    @Post()
    async create(
        @Body() createFundDto: CreateFundDto,
        @Auth('userId') userId: string,
    ) {
        const fund = await this.fundsService.create(createFundDto, userId)
        return {
            data: toResponse(ResponseFundDto, fund),
        }
    }

    @Get()
    async findAll(@Auth('userId') userId: string) {
        const funds = await this.fundsService.findAll(userId)
        return {
            data: toResponse(ResponseFundDto, funds),
        }
    }

    @Patch('reorder')
    async reorder(
        @Body() dto: ReorderFundsDto,
        @Auth('userId') userId: string,
    ) {
        const funds = await this.fundsService.reorder(dto, userId)
        return {
            data: toResponse(ResponseFundDto, funds),
        }
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateFundDto: UpdateFundDto,
        @Auth('userId') userId: string,
    ) {
        const fund = await this.fundsService.update(id, updateFundDto, userId)
        return {
            data: toResponse(ResponseFundDto, fund),
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Auth('userId') userId: string) {
        const fund = await this.fundsService.remove(id, userId)
        return {
            data: toResponse(ResponseFundDto, fund),
        }
    }
}
