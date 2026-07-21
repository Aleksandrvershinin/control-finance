import { forwardRef, Module } from '@nestjs/common'
import { AccountService } from './account.service'
import { AccountController } from './account.controller'
import { FundsModule } from 'src/funds/funds.module'
import { LedgerModule } from 'src/ledger/ledger.module'
import { TransactionsModule } from 'src/transactions/transactions.module'

@Module({
    imports: [FundsModule, LedgerModule, forwardRef(() => TransactionsModule)],
    controllers: [AccountController],
    providers: [AccountService],
    exports: [AccountService],
})
export class AccountModule {}
