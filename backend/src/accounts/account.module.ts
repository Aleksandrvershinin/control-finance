import { Module } from '@nestjs/common'
import { AccountService } from './account.service'
import { AccountController } from './account.controller'
import { FundsModule } from 'src/funds/funds.module'
import { TransactionsService } from 'src/transactions/transactions.service'
import { LedgerModule } from 'src/ledger/ledger.module'

@Module({
    imports: [FundsModule, LedgerModule],
    controllers: [AccountController],
    providers: [TransactionsService, AccountService],
})
export class AccountModule {}
