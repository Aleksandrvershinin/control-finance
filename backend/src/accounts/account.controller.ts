import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UseGuards,
    Req,
} from '@nestjs/common'

import { AccountService } from './account.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { ReorderAccountsDto } from './dto/reorderAccounts.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Auth } from 'src/common/decorators/auth.decorator'
import { toResponse } from 'src/common/mappers/response.mapper'
import { ResponseAccountDto } from './dto/response-account.dto'

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post()
    async create(
        @Auth('userId') userId: string,
        @Body() dto: CreateAccountDto,
    ) {
        const account = await this.accountService.create(userId, dto)
        return { data: toResponse(ResponseAccountDto, account) }
    }

    @Get()
    async findAll(@Auth('userId') userId: string) {
        const accounts = await this.accountService.findAll(userId)
        return { data: toResponse(ResponseAccountDto, accounts) }
    }

    @Patch('reorder')
    async reorder(
        @Auth('userId') userId: string,
        @Body() dto: ReorderAccountsDto,
    ) {
        const accounts = await this.accountService.reorder(userId, dto)
        return { data: toResponse(ResponseAccountDto, accounts) }
    }

    @Patch(':id')
    async update(
        @Auth('userId') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateAccountDto,
    ) {
        const account = await this.accountService.update(userId, id, dto)
        return { data: toResponse(ResponseAccountDto, account) }
    }

    @Delete(':id')
    async remove(@Auth('userId') userId: string, @Param('id') id: string) {
        const account = await this.accountService.remove(userId, id)
        return { data: toResponse(ResponseAccountDto, account) }
    }
}
