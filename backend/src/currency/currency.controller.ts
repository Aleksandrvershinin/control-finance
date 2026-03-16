import { Controller, Get } from '@nestjs/common'
import { CurrencyService } from './currency.service'
import { ResponseCurrencyDto } from './dto/response-currency.dto'
import { toResponse } from 'src/common/mappers/response.mapper'

@Controller('currencies')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) {}

    @Get()
    async findAll() {
        const currencies = await this.currencyService.findAll()

        return {
            data: toResponse(ResponseCurrencyDto, currencies),
        }
    }
}
