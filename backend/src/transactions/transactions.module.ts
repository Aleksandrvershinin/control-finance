import { forwardRef, Module } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { TransactionsController } from './transactions.controller'
import { LedgerModule } from 'src/ledger/ledger.module'
import { AccountModule } from 'src/accounts/account.module'
import { FundsModule } from 'src/funds/funds.module'

@Module({
    imports: [LedgerModule, forwardRef(() => AccountModule), FundsModule],
    controllers: [TransactionsController],
    providers: [TransactionsService],
    exports: [TransactionsService],
})
export class TransactionsModule {}
