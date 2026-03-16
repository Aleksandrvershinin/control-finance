import { Module } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { TransactionsController } from './transactions.controller'
import { LedgerModule } from 'src/ledger/ledger.module'

@Module({
    imports: [LedgerModule],
    controllers: [TransactionsController],
    providers: [TransactionsService],
})
export class TransactionsModule {}
