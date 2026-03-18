import {
    Controller,
    Delete,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Query,
} from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Auth } from 'src/common/decorators/auth.decorator'
import { plainToClass } from 'class-transformer'
import { ResponseTransactionDto } from './dto/response-transaction.dto'
import { GetTransactionsDto } from './dto/get-transactions.dto'
import { toResponse } from 'src/common/mappers/response.mapper'

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post()
    async create(
        @Auth('userId') userId: string,
        @Body() createTransactionDto: CreateTransactionDto,
    ) {
        const transaction = await this.transactionsService.create(
            userId,
            createTransactionDto,
        )
        return {
            success: true,
            data: plainToClass(ResponseTransactionDto, transaction, {
                excludeExtraneousValues: true,
            }),
        }
    }

    @Patch(':id')
    async update(
        @Auth('userId') userId: string,
        @Param('id') id: string,
        @Body() updateTransactionDto: UpdateTransactionDto,
    ) {
        const transaction = await this.transactionsService.update(
            userId,
            id,
            updateTransactionDto,
        )

        return {
            success: true,
            data: plainToClass(ResponseTransactionDto, transaction, {
                excludeExtraneousValues: true,
            }),
        }
    }

    @Delete(':id')
    async remove(@Auth('userId') userId: string, @Param('id') id: string) {
        const transaction = await this.transactionsService.remove(userId, id)

        return {
            success: true,
            data: plainToClass(ResponseTransactionDto, transaction, {
                excludeExtraneousValues: true,
            }),
        }
    }

    @Get()
    async getTransactions(
        @Auth('userId') userId: string,
        @Query() dto: GetTransactionsDto,
    ) {
        const result = await this.transactionsService.getTransactions(
            userId,
            dto,
        )

        return {
            success: true,
            data: toResponse(ResponseTransactionDto, result.data),
            hasNextPage: result.hasNextPage,
            nextCursor: result.nextCursor,
        }
    }

    @Get('summary')
    async getTransactionsSummary(
        @Auth('userId') userId: string,
        @Query() dto: GetTransactionsDto,
    ) {
        const summary = await this.transactionsService.getTransactionsSummary(
            userId,
            dto,
        )

        return {
            success: true,
            data: summary,
        }
    }

    @Get('analytics')
    async getTransactionsAnalytics(
        @Auth('userId') userId: string,
        @Query() dto: GetTransactionsDto,
    ) {
        const analytics =
            await this.transactionsService.getTransactionsAnalytics(userId, dto)

        return {
            success: true,
            data: analytics,
        }
    }
}
